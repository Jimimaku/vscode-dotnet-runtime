/*---------------------------------------------------------------------------------------------
*  Licensed to the .NET Foundation under one or more agreements.
*  The .NET Foundation licenses this file to you under the MIT license.
*--------------------------------------------------------------------------------------------*/
import * as fs from 'fs';
import { IEvent } from './IEvent';
import { ILoggingObserver } from './ILoggingObserver';

export class LoggingObserver implements ILoggingObserver
{
    private log: string[] = [];

    constructor(private readonly logFilePath: string) {}

    public post(event: IEvent): void
    {
        this.writeLine(`${new Date().toLocaleString()} ${new Date().getMilliseconds()} ${event.eventName}`);
        const properties = event.getProperties();
        if (properties)
        {
            for (const property of Object.values(properties))
            {
                this.writeLine(property);
            }
        }
        this.writeLine('');
    }

    private innerDispose(): Promise<void>
    {
        return fs.promises.writeFile(this.logFilePath, this.log.join('\n'));
    }

    public dispose(): void
    {
        this.innerDispose().catch(() => {});
    }

    public async disposeAsync(): Promise<void>
    {
        await this.innerDispose();
    }

    public getFileLocation(): string
    {
        return this.logFilePath;
    }

    private writeLine(line: string)
    {
        this.log.push(line);
    }
}
