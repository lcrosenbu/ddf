/**
 * Copyright (c) Codice Foundation
 * <p/>
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 * <p/>
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 */
package org.codice.ddf.migration.commands;

import java.lang.reflect.InvocationTargetException;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.commons.lang.StringUtils;
import org.apache.karaf.shell.api.action.Argument;
import org.apache.karaf.shell.api.action.Command;
import org.apache.karaf.shell.api.action.lifecycle.Service;
import org.codice.ddf.configuration.migration.ConfigurationMigrationService;
import org.codice.ddf.security.common.Security;

import com.google.common.annotations.VisibleForTesting;

import ddf.security.service.SecurityServiceException;

/**
 * Command class used to import the system configuration exported via the {@link ExportCommand} command.
 */
@Service
@Command(scope = MigrationCommand.NAMESPACE, name = "import", description =
        "Restores the system profile and configuration to the one recorded by a previously executed "
                + MigrationCommand.NAMESPACE + ":export command.")
public class ImportCommand extends MigrationCommand {
    @Argument(index = 0, name = "exportDirectory", description = "Path to directory where the import file is located", required = false, valueToShowInHelp = MigrationCommand.EXPORTED, multiValued = false)
    private String exportDirectoryArgument;

    public ImportCommand() {
    }

    @VisibleForTesting
    ImportCommand(ConfigurationMigrationService service, Security security, String arg) {
        super(service, security);
        this.exportDirectoryArgument = arg;
    }

    @Override
    public Object execute() {
        final Path exportDirectory;

        try {
            exportDirectory = (StringUtils.isEmpty(exportDirectoryArgument) ?
                    defaultExportDirectory :
                    Paths.get(exportDirectoryArgument));
            security.runWithSubjectOrElevate(() -> configurationMigrationService.doImport(
                    exportDirectory,
                    this::outputMessage));
        } catch (InvalidPathException | SecurityServiceException e) {
            outputErrorMessage(String.format(ERROR_MESSAGE, e.getMessage()));
        } catch (InvocationTargetException e) {
            outputErrorMessage(String.format(ERROR_MESSAGE,
                    e.getCause()
                            .getMessage()));
        }
        return null;
    }
}