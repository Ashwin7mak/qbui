
#### original goal of refactoring:
In general, the record store used the recId as the key to identify entries in the record store.  
Using the recId is bad practice since another record from a different table can have the same recId. Using the recId as the identifier would cause collisions for different entries.  
Our goal was to refactor the record store to always use appId, tblId, and recId when storing an entry in the record store. This is in addition to the `id` which is used to represent the record's context. For example a record with the same app/tbl/rec ids could have a different entry depending on where the record is displayed--the base report vs in a drawer etc.  
   
##### Challenges and difficulties
- The record store's entry is consumed by many files and many contexts:  
  files: reportGrid, recordTrowser, reportContent, nav, components/record, dataTable, appHistory  
  context: inline edit in report, trowser edit from report, trowser edit from record, trowser edit for new record via "Add Child" button in record, trowser edit for new record via "Add Child" button in record displayed in a drawer, trowser edit for new record via "Add Child" button in record trowser
- The SAVE_RECORD_SUCCESS action is handled by record store and report store
- We assumed that there would be at most only 1 record would be simultaneously edited in each context. The inline-edit's "Save and add a new row" button actually creates a new record entry before the currently edited record was done saving.
- The overall flow for inline-edit's "Save and add a new row" button is difficult to decipher how it's orchestrating everything
```
reportContent.handleRecordNewBlank
-> reportContent.handleRecordSaveClicked
  -> reportContent.handleRecordChange
    -> recordActions.updateRecord
      -> fire SAVE_RECORD action
      -> recordService.saveRecord
         .then
           => fire SAVE_RECORD_SUCCESS action
             -> record store, add new record for 'new' blank record
             -> report store, ReportModelHelper.addRecordToReport
               -> update report model
           => fire SAVE_RECORD_COMPLETE action on a 1ms delay
    .then
      => reportContent.setNewRowFieldChanges
```
This chain of logic contains 4 promises, at the deepest point 10 indentation deep nested logic (recordActions.createRecord), lots of logic is for syncing a change to record in record store with the report that contains the edited record, passing "flags" for branching logic (leads to many overall possible paths).
Because of the many possible paths, we hit many edge cases such as different behavior seen when clicking "Save and add a new row" from an existing record compared to when clicking "Save and add a new row" while editing a new record.

- The lack of e2e tests covering all the edge cases means every time we made a change, we had to do lots of manual testing to cover all edge cases.
- Inconsistent use and definition of `id` or `recId`
  - The recId for a record is sometimes stored as a number, a string representation of a number ('32'), a string such as 'new', or null.
      There were logic in many files to treat the recId defensively, such as to treat the recId as 'new' if the recId were null and vise versa. This led me to believe that I should perhaps enforce what is allowed to be stored as the recId. I settled on converting the recId in the record store to always be a number, except when the recId is null or 'new' we stored it as 'new'.
      Some files used null because we don't want to display a Record ID value of 'new', it should show up as blank for a record in a report.
      Some files used 'new', as in the case for recordTrowser because we don't want the query parameter in the url to say "?recId=null".


#### Future goals and guidelines:
The goal is still the same, we should force records in the record store to have app/tbl/rec ids as well as a unique view context id. We SHOULD standardize how we store recId--store as number, unless 'new'. Enforce the above guidelines by passing a RecordModel instead of passing function(appId, tblId, recId, otherParams) to recordActions.  

We can break down the needed work into smaller chunks and refactor in multiple passes. A suggested list of stories:
1. Add e2e tests and unit tests to reduce manual verification time.
1. pass RecordModels to recordActions, this can be done gradually
    1. treat the passed in parameter as RecordModel or a number/string fro recId
    1. apply the change to all recordActions
    1. make sure all files pass in RecordModels
1. RecordModels require app/tbl/rec ids
    * either RecordModels directly require them, with null being an acceptable value OR throw error in record reducer when app/tbl/rec ids are undefined
1. recIds must be number or 'new' (or null, just keep it consistent)
    * might be helpful to export a utility function from record store to convert recId to accepted form
    * RecordModel can also do the conversion when setting the recId

We also need a bigger discussion on refactoring our redux stores and how we sync records in record store with reports in report store
