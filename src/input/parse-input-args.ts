import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import path from 'path';

import { InputArgs } from './input-args';


const defaultOptions: InputArgs = {
    logFilePath: process.cwd(),
    numLines: 100,
    outputFile: process.cwd(),
    errorPercent: 10
}

// Defining input arguement options
const optionDefinitions = [
    { name: 'logFilePath', alias: 'f', type: String },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'numLines', alias: 'l', type: Number },
    { name: 'outputFile', alias: 'o', type: String },
    { name: 'errorPercent', alias: 'e', type: Number },
]

// Configuring the help to be printed
const sections = [
    {
        header: 'Log Anomaly App',
        content: 'Cheks for erros using log files'
    },
    {
        header: 'Options [ npm run start -- <args>  , Eg. npm run start -- -o . ]',
        optionList: [
            {
                name: 'logFilePath',
                typeLabel: '-f',
                description: 'The log file path for reading'
            },
            {
                name: 'outputFile',
                typeLabel: '-o',
                description: 'Output file for reference'
            },
            {
                name: 'numLines',
                typeLabel:'-l',
                description: 'Number of lines to be scanned in the log file.'
            },
            {
                name: 'errorPercent',
                typeLabel: '-e',
                description: 'Maximum allowed error percentage.'
            },
            {
                name: 'help',
                typeLabel: '-h',
                description: 'Print this usage guide.'
            },
        ]
    }
]


export function parseCommandLineArguments() {
    // Parse the input arguments
    const userOptions = commandLineArgs(optionDefinitions);

    // If no arguments specific or asked for help. Print help and exit
    if (userOptions.length === 0 || userOptions.help === true) {
        console.log(commandLineUsage(sections));
        // console.log("HEllo");
        process.exit();
    }

    if (userOptions.logFilePath) {
        userOptions.logFilePath = path.resolve(userOptions.logFilePath);
    }

    return { ...defaultOptions, ...userOptions };
}
