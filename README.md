# Anomaly Detector

# What is this?

Detects anomaly based on a log file. Tells where the anomaly is if error occurs is greater than certain amount.

# How do I use it?

## Building the repo

```sh
npm run build
```

## Type-checking the repo

```sh
npm run start -- -f <filepath> -e <allowed error percentage>
```
##Running a default log file present in this project
```sh
npm run start -- -f ./src/assets/file.log -e 11
```
