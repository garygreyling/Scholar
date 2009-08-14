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

  nowShowing: 'Scholar.directoryPage.showDetails',
  
  showDetails: function() {
    this.set('nowShowing', 'Scholar.directoryPage.showDetails');    
  },
  editDetails: function() {
    this.set('nowShowing', 'Scholar.directoryPage.editDetails');    
  },
}) ;
