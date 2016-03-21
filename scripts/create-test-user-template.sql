DECLARE
  is_rds NUMBER;
  user_count NUMBER;
  create_user VARCHAR2(200) := 'create user @testuser
    identified by "@password"
    default tablespace users
    quota unlimited on users';

BEGIN
  select count(username) into user_count from dba_users where username=UPPER('@testuser');
  select count(*) INTO is_rds FROM v$database WHERE SUBSTR(NAME,1,7) ='RDSORCL';

  /* If for some reason, the user exists, drop it */
  IF user_count > 0 THEN
      /* Kill the user's sessions */
      FOR ln_cur IN (SELECT sid, serial# FROM v$session WHERE username = UPPER('@testuser')) LOOP
        IF is_rds > 0 THEN
          EXECUTE IMMEDIATE ('BEGIN rdsadmin.rdsadmin_util.kill(' || ln_cur.sid || ' , ' || ln_cur.serial# || ', ''IMMEDIATE''); END;');
        ELSE
          EXECUTE IMMEDIATE ('ALTER SYSTEM KILL SESSION ''' || ln_cur.sid || ',' || ln_cur.serial# || ''' IMMEDIATE');
        END IF;
      END LOOP;

      --Intermittently, the user's session is not being killed before the user is dropped.  Trying a small sleep to see if this clear the problem.
      dbms_lock.sleep(5);

      /* Drop the user */
      EXECUTE IMMEDIATE ('DROP USER @testuser CASCADE');
  END IF;

  EXECUTE IMMEDIATE create_user;

  EXECUTE IMMEDIATE ('grant unlimited tablespace to @testuser');
  EXECUTE IMMEDIATE ('grant alter session to @testuser');
  EXECUTE IMMEDIATE ('grant select any table to @testuser');
  EXECUTE IMMEDIATE ('grant execute any procedure to @testuser');
  EXECUTE IMMEDIATE ('grant SELECT_CATALOG_ROLE to @testuser');
  EXECUTE IMMEDIATE ('grant connect,create session,resource,create view to @testuser');
  EXECUTE IMMEDIATE ('grant SELECT ANY DICTIONARY to @testuser');
  EXECUTE IMMEDIATE ('grant create any table to @testuser');
  EXECUTE IMMEDIATE ('grant drop tablespace,'
  || 'create type,'
  || 'drop any table,'
  || 'create tablespace,'
  || 'create session,'
  || 'create any index,'
  || 'create any sequence,'
  || 'create any procedure,'
  || 'alter any index,'
  || 'alter any indextype,'
  || 'alter any library,'
  || 'alter any materialized view,'
  || 'alter any sequence,'
  || 'alter any table,'
  || 'alter tablespace,'
  || 'drop any index,'
  || 'drop any indextype,'
  || 'drop any materialized view,'
  || 'drop any sequence,'
  || 'drop any view,'
  || 'execute any procedure to @testuser');

END;
/
