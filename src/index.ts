import { parseCommandLineArguments } from './input/parse-input-args';
import { AnomalyDetection } from './detection/anomalyDetection';
const userArgs = parseCommandLineArguments();
new AnomalyDetection(userArgs.logFilePath, userArgs.errorPercent);