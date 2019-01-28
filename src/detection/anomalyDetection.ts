import fs from "fs";

import { log } from "util";
export class AnomalyDetection {
    maxErrorPercent: number
    logFile: string;
    regexPerLine: RegExp;
    isPatternDetected: boolean;
    finalDict: { [id: string]: Array<string> };
    supportDict: { [id: string]: { count: number, currntLine: number } };
    errorFractionDict: {[id:string]:{ linesRead:number, errorsEncountered:number } };
    constructor(sampleLogFilePath: string, errorPercent:number) {
        this.finalDict = {};
        this.supportDict = {};
        this.isPatternDetected = false;
        this.logFile = sampleLogFilePath;
        this.errorFractionDict = {};
        this.maxErrorPercent = errorPercent;
        this.regexPerLine = RegExp(/([0-9-]+ [0-9:]+) ([A-Z]+) ([^:]+):([0-9]+) \[([a-z-]+([0-9]+)?)\] .*/);
        this.createPatternAndDetectAnomaly();
    }
    createPatternAndDetectAnomaly() {
        let testContent = fs.readFileSync(this.logFile, 'utf8').split("\n");
        testContent.forEach(element => {
            let logValueArray: RegExpMatchArray | null = element.match(this.regexPerLine);
            if (logValueArray) {
                if (!this.isPatternDetected) { this.detectPattern(logValueArray); }
                else {
                    this.detectAnomaly(logValueArray);
                }
            }
        });
        // fs.writeFileSync("./src/assets/file3.log", JSON.stringify(this.finalPatternArray))
    }

    detectPattern(logValueArray: RegExpMatchArray) {
        const minimumDuplicatesForPatternConfirmation = 5;
        let thread = logValueArray[5], filename = logValueArray[3];
        // let logString: string = `${logValueArray[2]}:${logValueArray[3]}:${logValueArray[4]}`
        let logString: string = `${logValueArray[3]}:${logValueArray[4]}`
        if (this.finalDict[thread]) {
            this.errorFractionDict[thread].linesRead +=1;
            if (this.finalDict[thread].includes(logString) &&
                this.finalDict[thread].indexOf(logString) == this.supportDict[thread].currntLine + 1) {
                this.supportDict[thread].currntLine += 1;
            }
            else if (logString == this.finalDict[thread][0]) {
                this.supportDict[thread].count += 1
                this.supportDict[thread].currntLine = 0;
            }
            else {
                this.finalDict[thread].push(logString);
            }
        }
        else {
            this.finalDict[thread] = [];
            this.supportDict[thread] = { count: 0, currntLine: 0 };
            this.errorFractionDict[thread] = { linesRead:1, errorsEncountered:0}
            this.finalDict[thread].push(logString);
        }
        let allThreads = Object.keys(this.supportDict);
        let numberOfThreads = allThreads.length;
        for (let i = 0; i < allThreads.length; i++) {
            if (this.supportDict[allThreads[i]].count >= 5) {
                if (allThreads.indexOf(allThreads[i]) == numberOfThreads - 1) {
                    this.isPatternDetected = true;
                }
            }
            else if (allThreads[i] == 'thread-main') {
                continue;
            }
            else {
                break;
            }
        }

    }

    detectAnomaly(logValueArray: RegExpMatchArray) {
        let filename = logValueArray[3], 
        lineNumber = logValueArray[4],
        logLevel = logValueArray[2],
        thread = logValueArray[5];
        if(!this.finalDict[thread].includes(`${filename}:${lineNumber}`)){
            this.errorFractionDict[thread].errorsEncountered+=1;
            this.errorFractionDict[thread].linesRead+=1;
            let errorPercent = (this.errorFractionDict[thread].errorsEncountered*100)/this.errorFractionDict[thread].linesRead;
            if(errorPercent > this.maxErrorPercent){
                console.log(`Errors for this thread: ${this.errorFractionDict[thread].errorsEncountered}`);
                console.log(`Lines read for this thread: ${this.errorFractionDict[thread].linesRead}`);
                console.log(errorPercent,"ANOMALY detected",logLevel,filename,lineNumber);
            }
        }


    }
}