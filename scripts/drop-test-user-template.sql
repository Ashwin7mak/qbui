DECLARE
  user_count NUMBER;
  is_rds NUMBER;

BEGIN
    /* Drop all tablespaces */
    FOR i IN (SELECT tablespace_name FROM dba_data_files where tablespace_name LIKE UPPER('%_@testuser_%')) LOOP
        BEGIN
            EXECUTE IMMEDIATE('DROP TABLESPACE ' || i.tablespace_name || ' INCLUDING CONTENTS AND DATAFILES');
        EXCEPTION
            WHEN OTHERS THEN
                CONTINUE; /* ignore exceptions, keep going */
        END;
    END LOOP;

    EXECUTE IMMEDIATE 'COMMIT';

    select count(username) into user_count from dba_users where username=UPPER('@testuser');
    select count(*) INTO is_rds FROM v$database WHERE SUBSTR(NAME,1,7) ='RDSORCL';

    IF user_count > 0 THEN

      /* Kill the user's sessions */
      FOR ln_cur IN (SELECT sid, serial# FROM v$session WHERE username = UPPER('@testuser')) LOOP
        BEGIN
          IF is_rds > 0 THEN
            EXECUTE IMMEDIATE ('BEGIN rdsadmin.rdsadmin_util.kill(' || ln_cur.sid || ' , ' || ln_cur.serial# || ', ''IMMEDIATE''); END;');
          ELSE
            EXECUTE IMMEDIATE ('ALTER SYSTEM KILL SESSION ''' || ln_cur.sid || ',' || ln_cur.serial# || ''' IMMEDIATE');
          END IF;
        EXCEPTION
          WHEN OTHERS THEN
            -- An exception is thrown when the user's session is not killed immediately, but will be killed in the future.
            -- This exception can safely be ignored.
            dbms_output.put_line('Exception thrown trying to kill process for user.  Continuing... ' || sqlcode);
            CONTINUE;
        END;
      END LOOP;

      --Intermittently, the user's session is not being killed before the user is dropped.  Trying a small sleep to see if this clear the problem.
      dbms_lock.sleep(5);

      /* Drop the user */
      EXECUTE IMMEDIATE ('DROP USER @testuser CASCADE');
    END IF;
END;
/
