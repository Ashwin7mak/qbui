
public class  Utils {
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
}
