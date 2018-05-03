import csv
import sys

"""
    0 (Sleep) = 10101
    1 (Personal Care) =  01 & 08
    2 (Housework) = 02 & 09
    3 (Education) = 06
    4 (Shopping) = 07
    5 (Eating & Drinking) = 11
    6 (Social) = 12
    7 (Care for Others) = 03 & 04 & 15
    8 (Sports) = 13
    9 (Work) = 05
    10 (Religion) = 14
    11 (Other)
    12 (Travel) = 18
"""

def main(filepath, filename):
    result = []
    summary = [\
                        {"name": "0", "index": 0, "size": 0},\
                        {"name": "1", "index": 1, "size": 0},\
                        {"name": "2", "index": 2, "size": 0},\
                        {"name": "3", "index": 3, "size": 0},\
                        {"name": "4", "index": 4, "size": 0},\
                        {"name": "5", "index": 5, "size": 0},\
                        {"name": "6", "index": 6, "size": 0},\
                        {"name": "7", "index": 7, "size": 0},\
                        {"name": "8", "index": 8, "size": 0},\
                        {"name": "9", "index": 9, "size": 0},\
                        {"name": "10", "index": 10, "size": 0},\
                        {"name": "11", "index": 11, "size": 0},\
                        {"name": "12", "index": 12, "size": 0}\
                ]
    chord = [\
        {"current": 0, "next": 0, "count": 0},\
        {"current": 0, "next": 1, "count": 0},\
        {"current": 0, "next": 2, "count": 0},\
        {"current": 0, "next": 3, "count": 0},\
        {"current": 0, "next": 4, "count": 0},\
        {"current": 0, "next": 5, "count": 0},\
        {"current": 0, "next": 6, "count": 0},\
        {"current": 0, "next": 7, "count": 0},\
        {"current": 0, "next": 8, "count": 0},\
        {"current": 0, "next": 9, "count": 0},\
        {"current": 0, "next": 10, "count": 0},\
        {"current": 0, "next": 11, "count": 0},\
        {"current": 1, "next": 0, "count": 0},\
        {"current": 1, "next": 1, "count": 0},\
        {"current": 1, "next": 2, "count": 0},\
        {"current": 1, "next": 3, "count": 0},\
        {"current": 1, "next": 4, "count": 0},\
        {"current": 1, "next": 5, "count": 0},\
        {"current": 1, "next": 6, "count": 0},\
        {"current": 1, "next": 7, "count": 0},\
        {"current": 1, "next": 8, "count": 0},\
        {"current": 1, "next": 9, "count": 0},\
        {"current": 1, "next": 10, "count": 0},\
        {"current": 1, "next": 11, "count": 0},\
        {"current": 2, "next": 0, "count": 0},\
        {"current": 2, "next": 1, "count": 0},\
        {"current": 2, "next": 2, "count": 0},\
        {"current": 2, "next": 3, "count": 0},\
        {"current": 2, "next": 4, "count": 0},\
        {"current": 2, "next": 5, "count": 0},\
        {"current": 2, "next": 6, "count": 0},\
        {"current": 2, "next": 7, "count": 0},\
        {"current": 2, "next": 8, "count": 0},\
        {"current": 2, "next": 9, "count": 0},\
        {"current": 2, "next": 10, "count": 0},\
        {"current": 2, "next": 11, "count": 0},\
        {"current": 3, "next": 0, "count": 0},\
        {"current": 3, "next": 1, "count": 0},\
        {"current": 3, "next": 2, "count": 0},\
        {"current": 3, "next": 3, "count": 0},\
        {"current": 3, "next": 4, "count": 0},\
        {"current": 3, "next": 5, "count": 0},\
        {"current": 3, "next": 6, "count": 0},\
        {"current": 3, "next": 7, "count": 0},\
        {"current": 3, "next": 8, "count": 0},\
        {"current": 3, "next": 9, "count": 0},\
        {"current": 3, "next": 10, "count": 0},\
        {"current": 3, "next": 11, "count": 0},\
        {"current": 4, "next": 0, "count": 0},\
        {"current": 4, "next": 1, "count": 0},\
        {"current": 4, "next": 2, "count": 0},\
        {"current": 4, "next": 3, "count": 0},\
        {"current": 4, "next": 4, "count": 0},\
        {"current": 4, "next": 5, "count": 0},\
        {"current": 4, "next": 6, "count": 0},\
        {"current": 4, "next": 7, "count": 0},\
        {"current": 4, "next": 8, "count": 0},\
        {"current": 4, "next": 9, "count": 0},\
        {"current": 4, "next": 10, "count": 0},\
        {"current": 4, "next": 11, "count": 0},\
        {"current": 5, "next": 0, "count": 0},\
        {"current": 5, "next": 1, "count": 0},\
        {"current": 5, "next": 2, "count": 0},\
        {"current": 5, "next": 3, "count": 0},\
        {"current": 5, "next": 4, "count": 0},\
        {"current": 5, "next": 5, "count": 0},\
        {"current": 5, "next": 6, "count": 0},\
        {"current": 5, "next": 7, "count": 0},\
        {"current": 5, "next": 8, "count": 0},\
        {"current": 5, "next": 9, "count": 0},\
        {"current": 5, "next": 10, "count": 0},\
        {"current": 5, "next": 11, "count": 0},\
        {"current": 6, "next": 0, "count": 0},\
        {"current": 6, "next": 1, "count": 0},\
        {"current": 6, "next": 2, "count": 0},\
        {"current": 6, "next": 3, "count": 0},\
        {"current": 6, "next": 4, "count": 0},\
        {"current": 6, "next": 5, "count": 0},\
        {"current": 6, "next": 6, "count": 0},\
        {"current": 6, "next": 7, "count": 0},\
        {"current": 6, "next": 8, "count": 0},\
        {"current": 6, "next": 9, "count": 0},\
        {"current": 6, "next": 10, "count": 0},\
        {"current": 6, "next": 11, "count": 0},\
        {"current": 7, "next": 0, "count": 0},\
        {"current": 7, "next": 1, "count": 0},\
        {"current": 7, "next": 2, "count": 0},\
        {"current": 7, "next": 3, "count": 0},\
        {"current": 7, "next": 4, "count": 0},\
        {"current": 7, "next": 5, "count": 0},\
        {"current": 7, "next": 6, "count": 0},\
        {"current": 7, "next": 7, "count": 0},\
        {"current": 7, "next": 8, "count": 0},\
        {"current": 7, "next": 9, "count": 0},\
        {"current": 7, "next": 10, "count": 0},\
        {"current": 7, "next": 11, "count": 0},\
        {"current": 8, "next": 0, "count": 0},\
        {"current": 8, "next": 1, "count": 0},\
        {"current": 8, "next": 2, "count": 0},\
        {"current": 8, "next": 3, "count": 0},\
        {"current": 8, "next": 4, "count": 0},\
        {"current": 8, "next": 5, "count": 0},\
        {"current": 8, "next": 6, "count": 0},\
        {"current": 8, "next": 7, "count": 0},\
        {"current": 8, "next": 8, "count": 0},\
        {"current": 8, "next": 9, "count": 0},\
        {"current": 8, "next": 10, "count": 0},\
        {"current": 8, "next": 11, "count": 0},\
        {"current": 9, "next": 0, "count": 0},\
        {"current": 9, "next": 1, "count": 0},\
        {"current": 9, "next": 2, "count": 0},\
        {"current": 9, "next": 3, "count": 0},\
        {"current": 9, "next": 4, "count": 0},\
        {"current": 9, "next": 5, "count": 0},\
        {"current": 9, "next": 6, "count": 0},\
        {"current": 9, "next": 7, "count": 0},\
        {"current": 9, "next": 8, "count": 0},\
        {"current": 9, "next": 9, "count": 0},\
        {"current": 9, "next": 10, "count": 0},\
        {"current": 9, "next": 11, "count": 0},\
        {"current": 10, "next": 0, "count": 0},\
        {"current": 10, "next": 1, "count": 0},\
        {"current": 10, "next": 2, "count": 0},\
        {"current": 10, "next": 3, "count": 0},\
        {"current": 10, "next": 4, "count": 0},\
        {"current": 10, "next": 5, "count": 0},\
        {"current": 10, "next": 6, "count": 0},\
        {"current": 10, "next": 7, "count": 0},\
        {"current": 10, "next": 8, "count": 0},\
        {"current": 10, "next": 9, "count": 0},\
        {"current": 10, "next": 10, "count": 0},\
        {"current": 10, "next": 11, "count": 0},\
        {"current": 11, "next": 0, "count": 0},\
        {"current": 11, "next": 1, "count": 0},\
        {"current": 11, "next": 2, "count": 0},\
        {"current": 11, "next": 3, "count": 0},\
        {"current": 11, "next": 4, "count": 0},\
        {"current": 11, "next": 5, "count": 0},\
        {"current": 11, "next": 6, "count": 0},\
        {"current": 11, "next": 7, "count": 0},\
        {"current": 11, "next": 8, "count": 0},\
        {"current": 11, "next": 9, "count": 0},\
        {"current": 11, "next": 10, "count": 0},\
        {"current": 11, "next": 11, "count": 0},\
        ]
    with open(filepath, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        curr_id = 0
        activities = []
        for row in reader:
            #ï»¿CASEID
            if row["CASEID"] != curr_id:
                curr_id = row["CASEID"]
                if len(activities) != 0:
                    result += [activities]
                    activities = []
            if len(row["ACTIVITY"]) == 5:
                if row["ACTIVITY"][0] == "1":
                    if row["ACTIVITY"] == "10101":
                        activities += [{"act": "0", "duration": int(row["DURATION"])}]
                        #summary[0]["size"] += int(row["DURATION"])
                    else:
                        activities += [{"act": "1", "duration": int(row["DURATION"])}]
                        #summary[1]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][0] == "8":
                    activities += [{"act": "1", "duration": int(row["DURATION"])}]
                    #summary[1]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][0] == "2" or row["ACTIVITY"][0] == "9":
                    activities += [{"act": "2", "duration": int(row["DURATION"])}]
                    #summary[2]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][0] == "3" or row["ACTIVITY"][0] == "4":
                    activities += [{"act": "7", "duration": int(row["DURATION"])}]
                    #summary[7]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][0] == "5":
                    activities += [{"act": "9", "duration": int(row["DURATION"])}]
                    #summary[9]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][0] == "6":
                    activities += [{"act": "3", "duration": int(row["DURATION"])}]
                    #summary[3]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][0] == "7":
                    activities += [{"act": "4", "duration": int(row["DURATION"])}]
                    #summary[4]["size"] += int(row["DURATION"])
                else:
                    activities += [{"act": "11", "duration": int(row["DURATION"])}]
                    #summary[11]["size"] += int(row["DURATION"])
            elif len(row["ACTIVITY"]) == 6:
                if row["ACTIVITY"][1] == "0":
                    activities += [{"act": "11", "duration": int(row["DURATION"])}]
                    #summary[11]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][1] == "1":
                    activities += [{"act": "5", "duration": int(row["DURATION"])}]
                    #summary[5]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][1] == "2":
                    activities += [{"act": "6", "duration": int(row["DURATION"])}]
                    #summary[6]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][1] == "3":
                    activities += [{"act": "8", "duration": int(row["DURATION"])}]
                    #summary[8]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][1] == "4":
                    activities += [{"act": "10", "duration": int(row["DURATION"])}]
                    #summary[10]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][1] == "5":
                    activities += [{"act": "7", "duration": int(row["DURATION"])}]
                    #summary[7]["size"] += int(row["DURATION"])
                elif row["ACTIVITY"][1] == "8":
                    activities += [{"act": "12", "duration": int(row["DURATION"])}]
                    #summary[12]["size"] += int(row["DURATION"])
                else:
                    activities += [{"act": "11", "duration": int(row["DURATION"])}]
                    #summary[11]["size"] += int(row["DURATION"])
                    
        result += [activities]
        
    for i in range(len(result)):
            j = 0
            while j < len(result[i]):
                if result[i][j]["act"] != "12":
                    k = 1
                    while j + k < len(result[i]) and (int(result[i][j + k]["act"]) == 12 or int(result[i][j + k]["act"]) == int(result[i][j]["act"])):
                        k += 1
                    if j + k == len(result[i]):
                        break
                    chord[12*int(result[i][j]["act"]) + int(result[i][j + k]["act"])]["count"] += 1
                    j += k    
                else:
                    j += 1
##            for j in range(len(result[i]) - 1):
##                if result[i][j]["act"] != "12":
##                    if result[i][j + 1]["act"] == "12":
##                        chord[12*int(result[i][j]["act"]) + int(result[i][(j + 2)%(len(result[i]) - 1)]["act"])]["count"] += 1
##                    else:
##                        chord[12*int(result[i][j]["act"]) + int(result[i][j + 1]["act"])]["count"] += 1
    print(chord)
        

##        sys.stdout = open(filename + ".js", "w")
##        print("var " + filename +  " = ")
##        print(result)
##        print(";")
##        print("var " + filename + "_summary = {\"name\": \"act_counts\", \"children\":")
##        print(summary)
##        print("};")

    
            

