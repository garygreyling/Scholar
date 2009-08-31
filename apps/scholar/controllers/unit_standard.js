// ==========================================================================
// Project:   Scholar.unitStandardController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
Scholar.unitStandardController = SC.ObjectController.create(
/** @scope Scholar.unitStandardController.prototype */ {
  _enrollmentSelectionHasChanged: function() {
     var unit_standard = Scholar.enrollmentsController.get('selection');
     if (unit_standard==undefined) return;
     this.set('content', unit_standard.firstObject());
  }.observes('Scholar.enrollmentsController.selection')
}) ;
