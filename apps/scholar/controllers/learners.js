// ==========================================================================
// Project:   Scholar.learnersController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Scholar.learnersController = SC.ArrayController.create(
/** @scope Scholar.learnersController.prototype */ {

  orderBy: 'lastName',
  currentLearner: null,

  _selectionHasChanged: function () {
    var selected_leaner = this.get('selection');
    this.set('currentLearner', selected_leaner);
  }.observes('selection')
}) ;
