@echo off
set JAVA_HOME=C:\Users\walid\.jdks\ms-17.0.17
cd /d C:\Users\walid\Downloads\Bks\Bks

REM Read classpath from file
set /p CLASSPATH=<classpath.txt

"%JAVA_HOME%\bin\java.exe" -cp "%CLASSPATH%" com.bks.BksApplication
