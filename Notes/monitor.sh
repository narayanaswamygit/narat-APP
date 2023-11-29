#!/bin/bash

# Define the recipient email addresses
RECIPIENTS=("narayana.n@taoautomation.com" "chaitra.shivanagoudar@taoautomation.com")

# Define the email subject
SUBJECT="High Resource Usage Alert"

# Check CPU, RAM, and disk usage
CPU_USAGE=$(top -b -n 1 | awk 'NR>7{s+=$9}END{print s}')
RAM_USAGE=$(free | awk '/Mem/{printf("%.2f"), $3/$2*100}')
DISK_USAGE=$(df / | awk 'NR==2{print $5}' | tr -d '%')

# Threshold for resource usage
THRESHOLD=1

# Check if any resource usage exceeds the threshold
if [ $(echo "$CPU_USAGE > $THRESHOLD" | bc -l) -eq 1 ] || \
   [ $(echo "$RAM_USAGE > $THRESHOLD" | bc -l) -eq 1 ] || \
   [ $(echo "$DISK_USAGE > $THRESHOLD" | bc -l) -eq 1 ]; then
    # Compose the email body
    EMAIL_BODY="CPU: $CPU_USAGE%\nRAM: $RAM_USAGE%\nDISK: $DISK_USAGE%"

    # Send an email
    for recipient in "${RECIPIENTS[@]}"; do
        echo -e "$EMAIL_BODY" | mail -s "$SUBJECT" "$recipient"
    done

fi
