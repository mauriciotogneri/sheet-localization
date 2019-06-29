#!/usr/bin/env bash

LOCALE="en"
FORMAT="json"
TOKEN="???"
URL="???"

wget "${URL}?locale=${LOCALE}&format=${FORMAT}&token=${TOKEN}"