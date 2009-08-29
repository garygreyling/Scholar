// ==========================================================================
// Project:   Scholar.Learner
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Scholar.Learner = SC.Record.extend(
/** @scope Scholar.Learner.prototype */ {

  firstName: SC.Record.attr(String),
  lastName: SC.Record.attr(String),
  dateOfBirth: SC.Record.attr(String),
  cellNumber: SC.Record.attr(String),
  surnameWithInitials: function() {
    return this.get('lastName') + ' ' + this.get('firstName').charAt(0);
  }.property('firstName', 'lastName'),

  courses: SC.Record.toMany('Scholar.Course')
}) ;
