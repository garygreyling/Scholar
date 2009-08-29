// ==========================================================================
// Project:   Scholar.enrollmentsController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document Your Controller Here)

  @extends SC.TreeController
*/
Scholar.enrollmentsController = SC.TreeController.create(
/** @scope Scholar.enrollmentsController.prototype */ {
  content: null,
  treeItemIsGrouped: YES,
  treeItemChildrenKey: 'unit_standards',
  orderBy: 'name',

  _selectionHasChanged: function () {
    var enrollments = Scholar.learnerController.get('enrollments');
    var enrollments_list = SC.Object.create(SC.TreeItemContent, {
      treeItemIsGrouped: YES,
      treeItemChildren: enrollments,
      count: enrollments.get('length'),
    })
    
    this.set('content', enrollments_list);
  }.observes('Scholar.learnerController.content')
}) ;
