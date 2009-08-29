// ==========================================================================
// Project:   Scholar.directoryController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
Scholar.directoryController = SC.ObjectController.create(
/** @scope Scholar.directoryController.prototype */ {

  nowShowing: 'Scholar.directoryPage.personalDetails.show.page',
  currentView: 'personal',

  showLearner: function() {
    this.set('nowShowing', 'Scholar.directoryPage.personalDetails.show.page');    
    this.set('currentView', 'personal');     
  },
  
  editLearner: function() {
    this.set('nowShowing', 'Scholar.directoryPage.personalDetails.edit.page'); 
  },

  newLearner: function() {
    var new_learner = Scholar.store.createRecord(Scholar.Learner, {lastName: "last name", firstName: 'first name'});
    Scholar.learnersController.set('currentLearner', new_learner);
    this.set('nowShowing', 'Scholar.directoryPage.newLearner');
  },
  createLearner: function () {
    var new_learner;
    new_learner = Scholar.learnerController.get('content');
    Scholar.learnersController.addObject(new_learner);
    Scholar.learnersController.selectObject(new_learner);
    Scholar.directoryController.set('nowShowing', 'Scholar.directoryPage.showLearner');
  },
  
  showEducationalDetails: function (){
    this.set('nowShowing', 'Scholar.directoryPage.educationalDetails.show.page');    
    this.set('currentView', 'educational');     
  }
    
}) ;
