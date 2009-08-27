// ==========================================================================
// Project:   Scholar.newLearnerController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
Scholar.newLearnerController = SC.ObjectController.create(
/** @scope Scholar.newLearnerController.prototype */ {
  createLearner: function () {
    var new_learner;
    new_learner = Scholar.newLearnerController.get('content');
    Scholar.learnersController.addObject(new_learner);
    Scholar.directoryController.set('nowShowing', 'Scholar.directoryPage.showLearner');
  }
}) ;
