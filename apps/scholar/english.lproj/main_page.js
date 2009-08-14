// ==========================================================================
// Project:   Scholar - mainPage
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

// This page describes the main user interface for your application.  
Scholar.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'directory toolbar'.w(),
    
    toolbar: SC.ToolbarView.design({
      anchorLocation: SC.ANCHOR_TOP
    }),
    directory: SC.SplitView.design({
      layout: { left: 0, top: 32, right: 0, bottom: 0 },
      defaultThickness: 200, 
      layoutDirection: SC.LAYOUT_HORIZONTAL,
      canCollapseViews: NO,
      
      topLeftMinThickness: 100,
      topLeftMaxThickness: 200,
      topLeftView: SC.ScrollView.design({
        hasHorizantalScroller: NO,
      
        contentView: SC.View.design({
          childViews: 'listView toolbar'.w(),
          backgroundColor: 'white', 
          
          listView: SC.ListView.design({  
            contentBinding: 'Scholar.learnersController.arrangedObjects',
            selectionBinding: 'Scholar.learnersController.selection',
            contentValueKey: 'surnameWithInitials'
          }),
          toolbar: SC.ToolbarView.design({
            anchorLocation: SC.ANCHOR_BOTTOM
          })
        })
      }),
      
      dividerView: SC.SplitDividerView,
           
      bottomRightView: SC.View.design({
        childViews: 'firstName lastName dateOfBirth cellNumber toolbar'.w(),
        backgroundColor: 'white',

        firstName: SC.LabelView.design({
          valueBinding: "Scholar.learnerController.firstName",
          layout: { left: 5, top: 5 },
          tagName: 'p'
        }),
        lastName: SC.LabelView.design({
          valueBinding: "Scholar.learnerController.lastName",
          layout: { left: 5, top: 25 },
          tagName: 'p'
        }),
        dateOfBirth: SC.LabelView.design({
          valueBinding: "Scholar.learnerController.dateOfBirth",
          layout: { left: 5, top: 45 },
          tagName: 'p'
        }),
        cellNumber: SC.LabelView.design({
          valueBinding: "Scholar.learnerController.cellNumber",
          layout: { left: 5, top: 65 },
          tagName: 'p'
        }),
        toolbar: SC.ToolbarView.design({
          anchorLocation: SC.ANCHOR_BOTTOM
        })
      })
    })
  })
});


