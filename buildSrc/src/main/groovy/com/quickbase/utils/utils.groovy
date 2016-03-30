package com.quickbase.utils;

public class Utils {
/**
 * Execute a shell command and return the output
 * @param cmd Command to execute
 * @return output from command
 */
    static String executeCmd(String cmd) {
        def sout = new StringBuffer(), serr = new StringBuffer();
        def proc = cmd.execute();
        proc.waitForProcessOutput(sout, serr);
        if (serr) {
            println serr.toString();
        }
        return sout.toString().trim();
    }

    /**
     * retrieve the aws private IP using the swimlane ID and given stack name ('current-stack'). If the
     * given stack name is "", then the private ip addresses for every stack in the swimlane will be returned
     * @param slid - siwmlane ID
     * @param stackName - specified stack name to retrieve private ip for
     * @return private ip address
     */
    static String getStackPrivateIpWithSLID (String slid, String stackName) {
        return executeCmd("aws ec2 describe-instances --filter Name=tag:SwimlaneID,Values=${slid} Name=tag:aws:cloudformation:stack-name,Values=*${stackName} --query Reservations[].Instances[].{IP:PrivateIpAddress} --output text");
    }

    static String generator (String alphabet, int n) {
        new Random().with {
            (1..n).collect { alphabet[ nextInt( alphabet.length() ) ] }.join()
        }
    }
}
