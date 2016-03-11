
BEGIN
    /* Drop all tablespaces */
    FOR i IN (SELECT tablespace_name FROM dba_data_files) LOOP
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

    END;
/

