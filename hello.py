import sys,json

import pymongo

arr=[]


if sys.argv[1]=="teacher":
          
     for i in range(2,len(sys.argv)):
          m=json.loads(sys.argv[i])
          #print(m)
          print(m['UNAME'],int(m['SDRN']),m['DESIG'],m['DUTIES'],m['REG_COUNT'],m['KT_COUNT'])

if sys.argv[1]=="timetable":
          
     for i in range(2,len(sys.argv)):
          m=json.loads(sys.argv[i])
          #print(m)
          print(m['exam'],m['exdate'],m['blocks'],m['examtype'])
          