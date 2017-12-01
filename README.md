# fize #

## Description ##
CLI tool that allows you to see the contents of a directory.  It does so by
looking at the extension of each file.  Inspired by my wanting to see the
composition of node source code, Github's repository language feature indicates
more js than C/C++ but I was skeptical b/c a large portion of it were tests.

## Installation ##
```bash
npm install -g fize
```

## Usage ##
```bash
$ fize  --depth 1 --afterDot 3 ./node/lib
```
![cli output](./out-eg.png)
