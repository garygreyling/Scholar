// ==========================================================================
// Project:   Scholar.Enrollment
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Scholar.Enrollment = SC.Record.extend( SC.TreeItemContent,
/** @scope Scholar.Enrollment.prototype */ {

  course: SC.Record.toOne('Scholar.Course'),

  name: function() {
    return this.get('course').get('name')
  }.property('course'),
  
  unit_standards: function() {
    return this.get('course').get('unit_standards')
  }.property('course'),
  
 
  // TreeController API requirements
  treeItemIsExpanded: YES,

  count: function() {
    return this.getPath('unit_standards.length')
  }.property('*unit_standards.length').cacheable(),
  
  treeItemChildren: function() {
    return this.get('unit_standards')
  }.property('unit_standards').cacheable(),
  
  treeItemBranchIndexes: function() { 
    return SC.IndexSet.EMPTY
  },
  
  description: function() {
    return this.get('name')
  }.property('name')
}) ;
