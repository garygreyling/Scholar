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
    var a = this.get('selection');
    this.set('currentLearner', a);
  }.observes('selection')
}) ;
