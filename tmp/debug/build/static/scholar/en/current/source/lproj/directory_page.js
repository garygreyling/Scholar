// ==========================================================================
// Project:   Scholar - directoryPage
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

// This page describes the main user interface for your application.  
Scholar.directoryPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'directory toolbar'.w(),
    
    toolbar: SC.ToolbarView.design({
      childViews: 'centerButtons'.w(),
      anchorLocation: SC.ANCHOR_TOP,

      centerButtons: SC.SegmentedView.design({
          layout: { top: 3 },
          valueBinding: 'Scholar.directoryController.currentView',

          items: [
            { title: "Personal Details", value: 'personal', target: "Scholar.directoryController", action: 'showLearner' },
            { title: "Educational Details", value: 'educational', target: "Scholar.directoryController", action: 'showEducationalDetails' }
          ],
          
          itemValueKey: 'value',
          itemTitleKey: 'title',
          itemTargetKey: 'target',
          itemActionKey: 'action'
      })  
    }),

    directory: SC.SplitView.design({
      layout: { left: 0, top: 33, right: 0, bottom: 0 },
      layoutDirection: SC.LAYOUT_HORIZONTAL,
      canCollapseViews: NO,
      
      topLeftMinThickness: 100,
      topLeftMaxThickness: 200,
      
      topLeftView: SC.View.design({
        childViews: 'listTitle scrollView toolbar'.w(),
        backgroundColor: 'white',
        
        listTitle: SC.View.design(SC.Border, {
          layout: { top: 0, left: 0, right: 0, height: 18 },
          childViews: 'listLabel'.w(),
          backgroundColor: '#DDD',
          borderStyle: SC.BORDER_BOTTOM,
          
          listLabel: SC.LabelView.design({
            layout: { left: 0, right: 0, top: 0 },
            classNames: ['list-title'],

            textAlign: SC.ALIGN_CENTER,
            value: 'Learners'
          })
        }),
      
        scrollView: SC.ScrollView.design(SC.Border,{
          layout: { top: 19, left: 0, right: 0, bottom: 32 },
          borderStyle: SC.BORDER_NONE,
          
          contentView: SC.ListView.design({ 
            contentBinding: 'Scholar.learnersController.arrangedObjects',
            selectionBinding: 'Scholar.learnersController.selection',
            contentValueKey: 'surnameWithInitials'
          })
        }),
        
        toolbar: SC.ToolbarView.design({
          anchorLocation: SC.ANCHOR_BOTTOM,
          childViews: 'addLearner'.w(),
          
          addLearner: SC.ButtonView.design({
            layout: { width: 50, top: 4, left: 4 },
            titleMinWidth: 0,
            title: 'Add',
            action: "newLearner",
            target: "Scholar.directoryController"
          })
        })
      }),
      
      dividerView: SC.SplitDividerView,
           
      bottomRightView: SC.ContainerView.design({
        layout: { top: 3, left: 10, right: 1 },
        backgroundColor: '#EEE',
        nowShowingBinding: 'Scholar.directoryController.nowShowing'
      })
    })
  }),
  
  // different views

  personalDetails: SC.Page.design({
    show: SC.Page.design({ 
      page: SC.View.design({
        childViews: 'firstName lastName dateOfBirth cellNumber toolbar'.w(),
        backgroundColor: 'white',

        firstName: SC.LabelView.design({
          valueBinding: "Scholar.learnerController.firstName",
          layout: { left: 10, top: 5 },
          tagName: 'p'
        }),
        lastName: SC.LabelView.design({
          valueBinding: "Scholar.learnerController.lastName",
          layout: { left: 10, top: 25 },
          tagName: 'p'
        }),
        dateOfBirth: SC.LabelView.design({
          valueBinding: "Scholar.learnerController.dateOfBirth",
          layout: { left: 10, top: 45 },
          tagName: 'p'
        }),
        cellNumber: SC.LabelView.design({
          valueBinding: "Scholar.learnerController.cellNumber",
          layout: { left: 10, top: 65 },
          tagName: 'p'
        }),
        toolbar: SC.ToolbarView.design({
          anchorLocation: SC.ANCHOR_BOTTOM,
          childViews: 'editLearner'.w(),
      
          editLearner: SC.ButtonView.design({
            layout: { width: 50, top: 4, left: 7 },
            titleMinWidth: 0,
            title: 'Edit',
            action: "editLearner",
            target: "Scholar.directoryController"
          })
        })
      })
    }),
    
    edit: SC.Page.design({ 
      page: SC.View.design({
        childViews: 'learnerForm toolbar'.w(),
        backgroundColor: 'white',

        learnerForm: Scholar.LearnerFormView,

        toolbar: SC.ToolbarView.design({
          anchorLocation: SC.ANCHOR_BOTTOM,
          childViews: 'showLearner'.w(),

          showLearner: SC.ButtonView.design({
            layout: { width: 50, top: 4, left: 7 },
            titleMinWidth: 0,
            title: 'Done',
            action: "showLearner",
            target: "Scholar.directoryController"
          })
        })
      })
    })
  }),
  
  educationalDetails: SC.Page.design({
    show: SC.Page.design({ 
      page: SC.SplitView.design({
        layout: { left: 0, top: 0, right: 0, bottom: 0 },
        layoutDirection: SC.LAYOUT_HORIZONTAL,
        canCollapseViews: NO,

        topLeftMinThickness: 100,
        topLeftMaxThickness: 200,

        topLeftView: SC.View.design({
          childViews: 'listTitle scrollView toolbar'.w(),
          backgroundColor: 'white',

          listTitle: SC.View.design(SC.Border, {
            layout: { top: 0, left: 0, right: 0, height: 18 },
            childViews: 'listLabel'.w(),
            backgroundColor: '#DDD',
            borderStyle: SC.BORDER_BOTTOM,

            listLabel: SC.LabelView.design({
              layout: { left: 0, right: 0, top: 0 },
              classNames: ['list-title'],

              textAlign: SC.ALIGN_CENTER,
              value: 'Courses'
            })
          }),

          scrollView: SC.ScrollView.design(SC.Border,{
            layout: { top: 19, left: 0, right: 0, bottom: 32 },
            borderStyle: SC.BORDER_NONE,

            contentView: SC.ListView.design({ 
              contentBinding: 'Scholar.enrollmentsController.arrangedObjects',
              selectionBinding: 'Scholar.enrollmentsController.selection',
              contentValueKey: 'description'
            })
          }),

          toolbar: SC.ToolbarView.design({
            anchorLocation: SC.ANCHOR_BOTTOM,
            childViews: 'addLearner'.w(),

            addLearner: SC.ButtonView.design({
              layout: { width: 55, top: 4, left: 6 },
              titleMinWidth: 0,
              title: 'Enroll',
              action: "newLearner",
              target: "Scholar.directoryController"
            })
          })
        }),

        dividerView: SC.SplitDividerView,

        bottomRightView: SC.ContainerView.design({
          layout: { top: 3, left: 10, right: 1 },
          backgroundColor: '#EEE'
        })
      })
    }),
    
    edit: SC.Page.design({ 
      page: SC.View.design({
        childViews: 'learnerForm toolbar'.w(),
        backgroundColor: 'white',

        learnerForm: Scholar.LearnerFormView,

        toolbar: SC.ToolbarView.design({
          anchorLocation: SC.ANCHOR_BOTTOM,
          childViews: 'showLearner'.w(),

          showLearner: SC.ButtonView.design({
            layout: { width: 50, top: 4, left: 7 },
            titleMinWidth: 0,
            title: 'Done',
            action: "showLearner",
            target: "Scholar.directoryController"
          })
        })
      }),

      buttons: SC.View.design({
        childViews: 'buttons'.w(),
        buttons: SC.ButtonView.design({
          layout: { width: 50, top: 4, left: 7 },
          titleMinWidth: 0,
          title: 'Edit',
          action: "editLearner",
          target: "Scholar.directoryController"
        })
      })
    })
  }),

  newLearner: SC.View.design({
    childViews: 'learnerForm toolbar'.w(),
    backgroundColor: 'white',

    learnerForm: Scholar.LearnerFormView,
    
    toolbar: SC.ToolbarView.design({
      anchorLocation: SC.ANCHOR_BOTTOM,
      childViews: 'showLearner'.w(),
      
      showLearner: SC.ButtonView.design({
        layout: { width: 65, top: 4, left: 7 },
        titleMinWidth: 0,
        title: 'Create',
        action: "createLearner",
        target: "Scholar.directoryController"
      })
    })
  })
});


