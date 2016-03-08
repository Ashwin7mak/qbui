
-- WARNING - This script deletes tablespaces, tables, and sequences in the Oracle database on which it is run
--    this can be used to clean up stranded test artifacts on a database that is used for testing or in a local dev env.
--
--    Do not execute this against a production database.
--
--    Email the development team before executing this clean up SQL on a shared database as it
--    will break currently running tests

DECLARE
  is_rds NUMBER;

BEGIN
    SELECT COUNT(*) INTO is_rds FROM v$database WHERE SUBSTR(NAME,1,7) ='RDSORCL';

    /* Drop all tablespaces */
    FOR i IN (SELECT tablespace_name FROM dba_data_files where tablespace_name LIKE UPPER('%_@testuser_%')) LOOP
        BEGIN
            EXECUTE IMMEDIATE('DROP TABLESPACE ' || i.tablespace_name || ' INCLUDING CONTENTS AND DATAFILES');
        EXCEPTION
            WHEN OTHERS THEN
                CONTINUE; /* ignore exceptions, keep going */
        END;
    END LOOP;

    /* Drop all sequences */
    FOR i in (SELECT * FROM user_sequences) LOOP
      BEGIN
        EXECUTE IMMEDIATE('DROP SEQUENCE ' || i.sequence_name);
        EXCEPTION
          WHEN OTHERS THEN
            CONTINUE; /* ignore exceptions, keep going */
      END;
    END LOOP;

    EXECUTE IMMEDIATE 'COMMIT';

    EXECUTE IMMEDIATE ('PURGE RECYCLEBIN');
    EXECUTE IMMEDIATE ('PURGE USER_RECYCLEBIN');

    IF is_rds > 0 THEN
      EXECUTE IMMEDIATE 'CREATE TABLESPACE rduii_@testuser_data DATAFILE SIZE 200M AUTOEXTEND ON NEXT 100 MAXSIZE UNLIMITED ENCRYPTION USING ''AES256'' DEFAULT STORAGE(ENCRYPT)';
      ELSE
      EXECUTE IMMEDIATE 'CREATE TABLESPACE rduii_@testuser_data DATAFILE ''/app/ora/tablespace_duii_@testuser_data_01.dbf'' SIZE 200M AUTOEXTEND ON NEXT 100 MAXSIZE UNLIMITED ENCRYPTION USING ''AES256'' DEFAULT STORAGE(ENCRYPT)';
    END IF;

    EXECUTE IMMEDIATE 'create sequence rduii_dbid_sequence start with 1 increment by 1 nocache nocycle';

    EXECUTE IMMEDIATE 'create table rduii_META (id varchar(128), data clob, CONSTRAINT PK_RDUII_META_ID PRIMARY KEY (id)) tablespace rduii_@testuser_data';

    EXECUTE IMMEDIATE 'create table rduii_APPPROPS (id varchar(128), data clob, CONSTRAINT PK_RDUII_APPPROPS_ID PRIMARY KEY (id)) tablespace rduii_@testuser_data';

    EXECUTE IMMEDIATE 'create table rduii_TABLES (id varchar(128), data clob, CONSTRAINT PK_RDUII_TABLES_ID PRIMARY KEY (id)) tablespace rduii_@testuser_data';

    EXECUTE IMMEDIATE 'create table rduii_REPORTS (appId VARCHAR2(128), tableId VARCHAR2(128), id varchar(128), data clob, CONSTRAINT PK_RDUII_REPORTS_APPID_TABLEID PRIMARY KEY (appId, tableId, id)) tablespace rduii_@testuser_data';

    EXECUTE IMMEDIATE 'COMMIT';


    EXECUTE IMMEDIATE 'CREATE TABLE RDUII_USERS ' ||
      '(ID VARCHAR2(128), ' ||
      'FIRSTNAME VARCHAR2(4000), ' ||
      'LASTNAME VARCHAR2(4000), ' ||
      'SCREENNAME VARCHAR2(4000), ' ||
      'EMAIL VARCHAR2(4000), ' ||
      'INTUITID VARCHAR2(4000), ' ||
      'CHALLENGEQUESTION VARCHAR2(4000), ' ||
      'CHALLENGEANSWER VARCHAR2(4000), ' ||
      'PASSWORD VARCHAR2(4000), ' ||
      'USERPROPS VARCHAR2(4000), ' ||
      'SYSRIGHTS VARCHAR2(4000), ' ||
      'DEACTIVATED NUMBER(*,0), ' ||
      'ANONYMOUS NUMBER(*,0), ' ||
      'ADMINISTRATOR NUMBER(*,0), ' ||
      'PLACEHOLDERID VARCHAR2(4000), ' ||
      'APPID VARCHAR2(4000), ' ||
      'TICKETVERSION NUMBER(*, 0), ' ||
      'CONSTRAINT PK_ID_RDUII_USERS PRIMARY KEY (ID) ' ||
      ') TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE INDEX I_RDUII_USERS_APPID ON RDUII_USERS (APPID) TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE INDEX I_RDUII_USERS_DEACTIVATED ON RDUII_USERS (DEACTIVATED) TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE INDEX I_RDUII_USERS_EMAIL ON RDUII_USERS (EMAIL) TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE INDEX I_RDUII_USERS_FIRSTNAME ON RDUII_USERS (FIRSTNAME) TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE INDEX I_RDUII_USERS_LASTNAME ON RDUII_USERS (LASTNAME) TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE INDEX I_RDUII_USERS_SCREENNAME ON RDUII_USERS (SCREENNAME) TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE SEQUENCE RDUII_userid_sequence START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE ';

    EXECUTE IMMEDIATE 'CREATE TABLE RDUII_USERAPPROLES ' ||
      '(	APPID VARCHAR2(128), USERID VARCHAR2(128), ROLEID NUMBER(*,0), ' ||
      'CONSTRAINT UQ_RDUII_USERAPPROLES_APPID_US UNIQUE (APPID, USERID, ROLEID) ENABLE, ' ||
      'CONSTRAINT FK_RDUII_USERAPPROLES_APPID FOREIGN KEY (APPID) REFERENCES RDUII_APPPROPS (ID) ON DELETE CASCADE ENABLE, ' ||
      'CONSTRAINT FK_RDUII_USERAPPROLES_USERID FOREIGN KEY (USERID) REFERENCES RDUII_USERS (ID) ON DELETE CASCADE ENABLE ' ||
      ') TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE INDEX I_RDUII_USERAPPROLES_APPID ON RDUII_USERAPPROLES (APPID) TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE INDEX I_RDUII_USERAPPROLES_ROLEID ON RDUII_USERAPPROLES (ROLEID) TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'CREATE INDEX I_RDUII_USERAPPROLES_USERID ON RDUII_USERAPPROLES (USERID) TABLESPACE RDUII_@testuser_DATA ';

    EXECUTE IMMEDIATE 'INSERT INTO rduii_META VALUES (''duii'',	''{ name: localhost, subdomain: localhost }'')';
    EXECUTE IMMEDIATE ('INSERT INTO RDUII_USERS (ID, FIRSTNAME, LASTNAME, SCREENNAME, EMAIL, ADMINISTRATOR, TICKETVERSION) VALUES (''10000'', ''administrator'', ''none'', ''administrator'', ''administrator@quickbase.com'', ''1'', 0)');
    EXECUTE IMMEDIATE 'COMMIT';


END;
/
