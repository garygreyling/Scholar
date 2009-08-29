// ==========================================================================
// Project:   Scholar.UnitStandard
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Scholar.UnitStandard = SC.Record.extend( SC.TreeItemContent,
/** @scope Scholar.UnitStandard.prototype */ {

  code: SC.Record.attr(String),
  
  // TreeController API requirements
  count: 0, // no unit_standards in a unit_standard...
  treeItemChildren: [],
  treeItemIsExpanded: NO,
  description: function () {
    return this.get('code')
  }.property('code')
}) ;
