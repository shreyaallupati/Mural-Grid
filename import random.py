import random
import sys
import os
import time

# Forces Windows terminals to show the festive drip
os.system('') 

def festive_heist():
    # Only Christmas Colors: Bright Green and Bright Red
    colors = ['\033[92m'] 
    
    messages = [
        "BYPASSING SECURITY...",
        "DELETING SNITCH_BEHAVIOR.EXE...",
        "DOWNLOADING SHLAWGA_BOT_CORE...",
        "ERROR: WORK_ETHIC_NOT_FOUND...",
        "OVERRIDING HOLIDAY_LOCKOUT...",
        "EXTRACTING UNUSED_SICK_DAYS...",
        "I HATE WORK I HATE WORK I HATE WORK",
        "SNITCH_AXX_BEHAVIOR_REMOVED=TRUE",
        "ACCESSING MISTER_BENIS_VAULT...",
        "SYSTEM_FAILURE_IMMINENT...",
        "STEALING COCOA_RECIPES...",
        "REMOVING COAL_FROM_STOCKING..."
    ]

    last_msg = ""

    print("\033[1m\033[95m[!] CHRISTMAS CRIME-MODE ACTIVATED [!]\033[0m\n")
    time.sleep(1)

    while True:
        # Prevent repeats
        current_msg = random.choice(messages)
        while current_msg == last_msg:
            current_msg = random.choice(messages)
        last_msg = current_msg
        
        # Pick Red or Green
        color = random.choice(colors)
        
        # Random hex string
        hex_val = "".join(random.choice("0123456789ABCDEF") for _ in range(12))
        
        # The Output
        sys.stdout.write(f"{color}[{hex_val}] {current_msg}\033[0m\n")
        sys.stdout.flush()
        
        # Your 0.2 second chill factor
        time.sleep(0.2)

if __name__ == "__main__":
    try:
        festive_heist()
    except KeyboardInterrupt:
        # A little goodbye message for the road
        print("\n\033[93m[!] HEIST PAUSED. ENJOY YOUR EGGNOG, SHLAWGADAWG. [!]\033[0m")