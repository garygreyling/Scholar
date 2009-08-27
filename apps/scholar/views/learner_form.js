// ==========================================================================
// Project:   Scholar.LearnerForm
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Scholar.LearnerFormView = SC.View.extend(
/** @scope Scholar.LearnerFormView.prototype */ {
    childViews: 'firstName lastName dateOfBirth cellNumber'.w(),
    backgroundColor: 'white',

    firstName: SC.TextFieldView.design({
      valueBinding: "Scholar.learnerController.firstName",
      layout: { height: 21, top: 5, left: 10, width: 100 }
    }),
    lastName: SC.TextFieldView.design({
      valueBinding: "Scholar.learnerController.lastName",
      layout: { height: 21, top: 27, left: 10, width: 100 }
    }),
    dateOfBirth: SC.TextFieldView.design({
      valueBinding: "Scholar.learnerController.dateOfBirth",
      layout: { height: 21, top: 49, left: 10, width: 100 }
    }),
    cellNumber: SC.TextFieldView.design({
      valueBinding: "Scholar.learnerController.cellNumber",
      layout: { height: 21, top: 71, left: 10, width: 100 }
    })
});
