// ==========================================================================
// Project:   Scholar.Course
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Scholar.Course = SC.Record.extend(
/** @scope Scholar.Course.prototype */ {
  name: SC.Record.attr(String),
  code: SC.Record.attr(String),
  unit_standards: SC.Record.toMany('Scholar.UnitStandard')

}) ;
