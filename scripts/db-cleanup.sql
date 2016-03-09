
-- WARNING - This script deletes tablespaces, tables, and sequences in the Oracle database on which it is run
--    this can be used to clean up stranded test artifacts on a database that is used for testing or in a local dev env.
--
--    Do not execute this against a production database.
--
--    Email the development team before executing this clean up SQL on a shared database as it
--    will break currently running tests

BEGIN
    EXECUTE IMMEDIATE ('ALTER TABLE RDUII_USERAPPROLES disable constraint FK_RDUII_USERAPPROLES_USERID');
    EXECUTE IMMEDIATE ('ALTER TABLE RDUII_USERAPPROLES disable constraint FK_RDUII_USERAPPROLES_APPID');

    /* Drop all tablespaces */
    FOR i IN (SELECT tablespace_name
              FROM dba_data_files
              WHERE tablespace_name LIKE '%_DATA' AND tablespace_name NOT IN ('RDUII_CADMIN_DATA')) LOOP
        BEGIN
            EXECUTE IMMEDIATE('DROP TABLESPACE ' || i.tablespace_name || ' INCLUDING CONTENTS AND DATAFILES');
        EXCEPTION
            WHEN OTHERS THEN
                CONTINUE; /* ignore exceptions, keep going */
        END;
    END LOOP;

    /* Drop all sequences */
    FOR i in (SELECT *
              FROM user_sequences
              WHERE sequence_name LIKE 'R%_%_SEQUENCE' AND sequence_name NOT LIKE 'RDUII_%_SEQUENCE') LOOP
        BEGIN
            EXECUTE IMMEDIATE('DROP SEQUENCE ' || i.sequence_name);
        EXCEPTION
            WHEN OTHERS THEN
                CONTINUE; /* ignore exceptions, keep going */
        END;
    END LOOP;

    /* Drop all constraints from remaining tables */
    FOR i IN (SELECT table_name
              FROM user_tables
              WHERE table_name NOT IN ('RDUII_APPPROPS', 'RDUII_META', 'RDUII_TABLES', 'RDUII_REPORTS', 'RDUII_USERS', 'RDUII_USERAPPROLES')) LOOP
        BEGIN

            FOR r IN ( SELECT table_name, constraint_name
                       FROM user_constraints
                       WHERE constraint_type = 'R' AND TABLE_NAME IN (i.table_name))
            LOOP
                EXECUTE IMMEDIATE('ALTER TABLE '||r.table_name
                          ||' DROP CONSTRAINT '|| r.constraint_name || ' CASCADE');
            END LOOP;
        END;
    END LOOP;

    /* Drop all remaining tables */
    FOR i IN (SELECT table_name
              FROM user_tables
              WHERE table_name NOT IN ('RDUII_APPPROPS', 'RDUII_META', 'RDUII_TABLES', 'RDUII_REPORTS', 'RDUII_USERS', 'RDUII_USERAPPROLES')) LOOP
        BEGIN
            EXECUTE IMMEDIATE('DROP TABLE ' || i.table_name);
        EXCEPTION
            WHEN OTHERS THEN
                CONTINUE; /* ignore exceptions, keep going */
        END;
    END LOOP;

    /* Drop all functions*/
    FOR i IN (SELECT *
         FROM user_objects
         WHERE object_type in ('FUNCTION')) LOOP
      BEGIN
        EXECUTE IMMEDIATE('drop '||i.object_type||' '||i.object_name);
      EXCEPTION
        WHEN OTHERS THEN
             CONTINUE; /* ignore exceptions, keep going */
      END;
    END LOOP;

    EXECUTE IMMEDIATE('TRUNCATE TABLE RDUII_USERAPPROLES');
    EXECUTE IMMEDIATE('TRUNCATE TABLE RDUII_APPPROPS');
    EXECUTE IMMEDIATE('TRUNCATE TABLE RDUII_REPORTS');
    EXECUTE IMMEDIATE('TRUNCATE TABLE RDUII_TABLES');
    EXECUTE IMMEDIATE('TRUNCATE TABLE RDUII_USERS');

    EXECUTE IMMEDIATE ('ALTER TABLE RDUII_USERAPPROLES enable constraint FK_RDUII_USERAPPROLES_USERID');
    EXECUTE IMMEDIATE ('ALTER TABLE RDUII_USERAPPROLES enable constraint FK_RDUII_USERAPPROLES_APPID');
    EXECUTE IMMEDIATE ('INSERT INTO RDUII_USERS (ID, FIRSTNAME, LASTNAME, SCREENNAME, EMAIL, ADMINISTRATOR) VALUES (''10000'', ''administrator'', ''none'', ''administrator'', ''administrator@quickbase.com'', ''1'')');
    EXECUTE IMMEDIATE ('PURGE RECYCLEBIN');
    EXECUTE IMMEDIATE ('PURGE USER_RECYCLEBIN');
END;
/
