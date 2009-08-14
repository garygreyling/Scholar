// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
require('panes/picker');
require('views/menu_item');

// Constants
SC.BENCHMARK_MENU_PANE_RENDER = YES ;

/**
  @class SC.MenuPane
  @extends SC.PickerPane
  @since SproutCore 1.0
*/
SC.MenuPane = SC.PickerPane.extend( 
/** @scope SC.MenuPane.prototype */ {

  menuItemKeys: 'itemTitleKey itemValueKey itemIsEnabledKey itemIconKey itemSeparatorKey itemActionKey itemCheckboxKey itemShortCutKey itemBranchKey itemHeightKey subMenuKey itemKeyEquivalentKey itemTargetKey'.w(),
  classNames: ['sc-menu'],

  tagName: 'div',
  
  isModal: YES,

  /**
    The key that explains whether each item is Enabled. If omitted, no icons 
    will be displayed.

    @readOnly
    @type Boolean
    @default isEnabled
  */
  itemIsEnabledKey: "isEnabled",
  
  /**
    The key that contains the title for each item.  If omitted, no icons will
     be displayed.

    @readOnly
    @type String
    @default title
  */
  itemTitleKey: 'title',

  /**
    The array of items to display.  This can be a simple array of strings,
    objects or hashes.  If you pass objects or hashes, you must also set the
    various itemKey properties to tell the MenuPane how to extract the
    information it needs.

    @type String
  */ 
  items: [],

  /** 
    The key that contains the value for each item.  If omitted, no icons will
    be displayed.

    @readOnly
    @type String
    @default value
  */
  itemValueKey: 'value',

  /** 
    The key that contains the icon for each item.  If omitted, no icons will
    be displayed.

    @readOnly
    @type String
    @default icon
  */
  itemIconKey: 'icon',

  /** 
    The width for each menu item and ultimately the menu itself.

    @type String
  */
  itemWidth: null,
  
  /** 
    The default height for each menu item.

    @type String
  */
  itemHeight: 20,

  /** 
    The height of the menu and ultimately the menu itself.

    @type Integer
  */
  menuHeight: null,
  
  /** 
    The height for each menu item and ultimately the menu itself.

    @readOnly
    @type String
    @default height
  */
  itemHeightKey: 'height',
  
  /** 
    The submenu for a menu item if any.

    @readOnly
    @type String
    @default subMenu
  */
  subMenuKey: 'subMenu',

  /**
    If YES, titles will be localized before display.
  */
  localize: YES,

  /** 
    This key defined which key represents Separator.

    @readOnly
    @type Boolean
    @default separator
  */  
  itemSeparatorKey: 'separator',

  /** 
    This key is need to assign an action to the menu item.

    @readOnly
    @type String
    @default action
  */
  itemActionKey: 'action',

  /** 
    The key for setting a checkbox for the menu item.

    @readOnly
    @type String
    @default checkbox
  */
  itemCheckboxKey: 'checkbox',

  /** 
    The key for setting a branch for the menu item.

    @readOnly
    @type String
    @default branchItem
  */
  itemBranchKey: 'branchItem',
  
  /** 
    The key for setting a branch for the menu item.

    @readOnly
    @type String
    @default shortcut
  */
  itemShortCutKey: 'shortcut',
  
  /** 
    The key for setting Key Equivalent for the menu item.

    @readOnly
    @type String
    @default keyEquivalent
  */
  itemKeyEquivalentKey: 'keyEquivalent',
  
  /** 
    The key for setting Key Equivalent for the menu item.

    @readOnly
    @type String
    @default target
  */
  itemTargetKey: 'target',
  
  /** @private */
  isKeyPane: YES,

  /** @private */
  preferType: SC.PICKER_MENU,

  /**
    Define the current Selected Menu Item.

    type SC.MenuItemView
  */
  currentSelectedMenuItem : null,

  /**
    Define the current Selected Menu Item.

    @type SC.MenuItemView
  */
  previousSelectedMenuItem : null,

  /**
    The anchor for this Menu

    @type ButtonView/MenuItemView
  */
  anchor: null,
  
  /** @private

    Array of Display Items which is produced by displayItems function
  */
  displayItemsArray: null,
  
  /**
    Set of Menu Item Views created from items array
    
    @type SC.Array
  */
  menuItemViews: [],

  /** 
    Example view which will be used to create the Menu Items
    
    @default SC.MenuItemView
    @type SC.View
  */
  exampleView: SC.MenuItemView,
  
  /**
    @private
    
    Overwrite the popup function of the pickerPane
  */
  popup: function(anchorViewOrElement, preferMatrix) {  
    var anchor = anchorViewOrElement.isView ? anchorViewOrElement.get('layer') : anchorViewOrElement;
    this.beginPropertyChanges();
    this.set('anchorElement',anchor) ;
    this.set('anchor',anchorViewOrElement);
    this.set('preferType',SC.PICKER_MENU) ;
    if(preferMatrix) this.set('preferMatrix',preferMatrix) ;
    this.endPropertyChanges();
    this.append() ;
    this.positionPane() ;
    this.becomeKeyPane() ;
  },
  
  /**
    This computed property is generated from the items array

    @property
    @type {String}
  */
  displayItems: function() {
    var items = this.get('items') ;
    var loc = this.get('localize') ;
    var keys = null,itemType, cur ;
    var ret = [], rel;
    var max = items.get('length') ;
    var idx, item ;
    var fetchKeys = SC._menu_fetchKeys ;
    var fetchItem = SC._menu_fetchItem ;
    var menuHeight = 0 ;
    // loop through items and collect data
    for (idx = 0; idx < max; ++idx) {
      item = items.objectAt(idx) ;
      if (SC.none(item)) continue ;
      itemType = SC.typeOf(item) ;
      rel = ret.length;
      if (itemType === SC.T_STRING) {
        ret[rel] = SC.Object.create({ title: item.humanize().titleize(),   
	                        value: item, isEnabled: YES, icon: null, 
	                        isSeparator: null, action: null, isCheckbox: NO, 
	                        menuItemNumber: idx, isShortCut: NO, isBranch: NO,
	                        itemHeight: 20, subMenu: null,keyEquivalent: null,
	                        target:null });
        menuHeight = menuHeight+20 ;
      } else if (itemType !== SC.T_ARRAY) {
          if (keys === null) keys = this.menuItemKeys.map(fetchKeys, this) ;
          cur = keys.map(fetchItem, item) ;
          cur[cur.length] = idx ;
          if (!keys[0] && item.toString) cur[0] = item.toString() ;
          if (!keys[1]) cur[1] = item ;
          if (!keys[2]) cur[2] = YES ;
          if (!cur[9]) cur[9] = this.get('itemHeight') ;
          if (cur[4]) cur[9] = 9 ;
          menuHeight = menuHeight+cur[9] ;
          if (loc && cur[0]) cur[0] = cur[0].loc() ;
          ret[rel] = SC.Object.create({ title: cur[0], value: cur[1],
                                              isEnabled: cur[2], icon: cur[3], 
                                              isSeparator: cur[4]||NO , action: cur[5],
                                              isCheckbox: cur[6], isShortCut: cur[7],
                                              menuItemNumber: idx, isBranch: cur[8],
                                              itemHeight: cur[9], subMenu: cur[10], 
                                              keyEquivalent: cur[11], target: cur[12] }) ;                         
      }
    }
    this.set('menuHeight',menuHeight);
    this.set('displayItemsArray',ret);
    return ret;
  }.property('items').cacheable(),

  /**
    If the items array itself changes, add/remove observer on item...
  */
  itemsDidChange: function() {
    if (this._items) {
      this._items.removeObserver('[]', this, this.itemContentDidChange) ;
    }
    this._items = this.get('items') ;
    if (this._items) {
      this._items.addObserver('[]', this, this.itemContentDidChange) ;
    }
    this.itemContentDidChange() ;
  }.observes('items'),

  /** 
    Invoked whenever the item array or an item in the array is changed.  This 
    method will reginerate the list of items.
  */
  itemContentDidChange: function() {
    this.notifyPropertyChange('displayItems') ;
  },

  // ..........................................................
  // RENDERING/DISPLAY SUPPORT
  // 
  displayProperties: ['displayItems', 'value'],

  /**
    The render function which depends on the displayItems and value
  */
  render: function(context, firstTime) {
    if (SC.BENCHMARK_MENU_PANE_RENDER) {
      var bkey = '%@.render'.fmt(this) ;
      SC.Benchmark.start(bkey);
    }
    // collect some data 
    var items = this.get('displayItems') ;
    //var ret = arguments.callee.base.apply(this,arguments);
    // regenerate the buttons only if the new display items differs from the
    // last cached version of it.

    var last = this.get('_menu_displayItems') ;
    if (firstTime || (items !== last)) {
      if(!this.get('isEnabled') || !this.get('contentView')) return ;
      var menuHeight = this.get('menuHeight');
      this.set('_menu_displayItems',items) ; // save for future
      context.addStyle('text-align', 'center') ;
      var itemWidth = this.get('itemWidth') ;
      if (SC.none(itemWidth)) {
        itemWidth = this.get('layout').width || 100;
        this.set('itemWidth',itemWidth) ; 
      }
      this.renderChildren(context,items) ;
      context.push("<div class='top-left-edge'></div>",
       "<div class='top-edge'></div>",
       "<div class='top-right-edge'></div>",
       "<div class='right-edge'></div>",
       "<div class='bottom-right-edge'></div>",
       "<div class='bottom-edge'></div>",
       "<div class='bottom-left-edge'></div>",
       "<div class='left-edge'></div>");
    }
    else {
      this.get('menuItemViews').forEach( function(menuItemView) { 
        menuItemView.updateLayer();
      }, this) ;
    }
    if (SC.BENCHMARK_MENU_PANE_RENDER) SC.Benchmark.end(bkey) ;
    //return ret ;
  },

  /**
    This method is used to observe the menuHeight and set the layout accordingly
    and position the pane.
    
    @observes menuHeight
  */
  menuHeightObserver: function() {
    var height = this.layout.height ;
    var menuHeight = this.get('menuHeight') ; 
    if( height !== menuHeight) {
      this.adjust('height',menuHeight).updateLayout() ;
    }
  }.observes('menuHeight'),
  
  /**
    Actually generates the menu HTML for the display items.  This method 
    is called the first time a view is constructed and any time the display
    items change thereafter.  This will construct the HTML but will not set
    any "transient" states such as the global isEnabled property or selection.
  */
  renderChildren: function(context,items) {
    if(!this.get('isEnabled')) return ;
    var menuItemViews = [];
    var len = items.length ;
    var content = SC.makeArray(items) ;
    for (var idx = 0; idx < len; ++idx) {
      var item = items[idx];
      var itemTitle = item.get('title') ;
      var itemValue = item.get('value') ;
      var itemIsEnabled = item.get('isEnabled') ;
      var itemIcon = item.get('icon') ;
      var isSeparator = item.get('isSeparator') ;
      var itemAction = item.get('action') ;
      var isCheckbox = item.get('isCheckbox') ;
      var menuItemNumber = item.get('menuItemNumber') ;
      var isShortCut = item.get('isShortCut') ;
      var isBranch   = item.get('isBranch') ;
      var itemSubMenu = item.get('subMenu') ;
      var itemHeight = item.get('itemHeight') ;
      var itemKeyEquivalent = item.get('keyEquivalent') ;
      var itemTarget = item.get('target') ;
      var itemWidth = this.get('itemWidth') ;
      
      var itemView = this.createChildView(
        this.exampleView, {
          owner : itemView,
          displayDelegate : itemView,
          parentPane: this,
          anchor : this.get('anchor'),
          isVisible : YES,
          contentValueKey : 'title',
          contentIconKey : 'icon',
          contentCheckboxKey: this.itemCheckboxKey,
          contentIsBranchKey :'branchItem',  
          isSeparatorKey : 'separator',
          shortCutKey : 'shortCut',  
          action : itemAction,
          target : itemTarget,
          layout : { top: 0, left: 0, width: itemWidth, height: itemHeight },
          isEnabled : itemIsEnabled,
          itemHeight : itemHeight,
          itemWidth : itemWidth,
          keyEquivalent : itemKeyEquivalent,
          content : SC.Object.create({
            title : itemTitle,
            value : itemValue,
            icon : itemIcon,
            separator : isSeparator,
            action : itemAction,
            checkbox : isCheckbox,
            shortCut : isShortCut,
            branchItem : isBranch,
            subMenu : itemSubMenu
          }),
        rootElementPath : [menuItemNumber]
      });
      context = context.begin(itemView.get('tagName')) ;
      itemView.prepareContext(context, YES) ;
      context = context.end() ;
      menuItemViews.push(itemView) ;
      this.set('menuItemViews',menuItemViews) ;
    }
  },
  
  /**
    Get the current selected Menu item
    
    @returns void
  */
  currentSelectedMenuItemObserver: function(){
    var currentSelectedMenuItem = this.get('currentSelectedMenuItem') ;
    var previousSelectedMenuItem = this.get('previousSelectedMenuItem') ;
    if(previousSelectedMenuItem){
      var subMenu = previousSelectedMenuItem.isSubMenuAMenuPane() ;
      if(subMenu) subMenu.remove() ;
      previousSelectedMenuItem.resignFirstResponder() ;
    }
    if(currentSelectedMenuItem) {
      currentSelectedMenuItem.becomeFirstResponder() ;
    }
  }.observes('currentSelectedMenuItem'),
  
  /**
    This function returns whether the anchor is of type of MenuItemView
    
    @returns Boolean
  */
  isAnchorMenuItemType: function() {
    var anchor = this.get('anchor') ;
    return (anchor && anchor.kindOf && anchor.kindOf(SC.MenuItemView)) ;
  },
  
  //..........................................................
  // mouseEvents and keyBoard Events handling
  //..........................................................

  /**
    Perform actions equivalent for the keyBoard Shortcuts

    @param {String} keystring
    @param {SC.Event} evt
    @returns {Boolean}  YES if handled, NO otherwise
  */
  performKeyEquivalent: function(keyString,evt) {
    var items, len, menuItems, item, keyEquivalent, 
        action, isEnabled, target;
    if(!this.get('isEnabled')) return NO ;
    this.displayItems() ;
    items = this.get('displayItemsArray') ;
    if (!items) return NO;

    len = items.length ;
    for(var idx=0; idx<len; ++idx) {
      item          = items[idx] ;
      keyEquivalent = item.get('keyEquivalent') ;
      action        = item.get('action') ;
      isEnabled     = item.get('isEnabled') ;
      target        = item.get('target') || this ;
      if(keyEquivalent == keyString && isEnabled) {
        var retVal = SC.RootResponder.responder.sendAction(action,target);
        return retVal;
      }
    }
    return NO ;
  },
  
  //Mouse and Key Events
  
  /** @private */
  mouseDown: function(evt) {
    return YES ;
  },
  
  /** 
    @private 
    
    Get the anchor and send the event to the anchor in case the 
    current Menu is a subMenu
  */
  mouseUp: function(evt) {
    this.remove() ;
    var anchor = this.get('anchor') ;
    if(this.isAnchorMenuItemType()) this.sendEvent('mouseUp', evt, anchor) ;
    return YES ;
  },
  
  /** 
    @private 
    
    This function gets called from the Menu Item in order to set the 
    current Selected Menu Item and move the selection
  */
  moveDown: function(menuItem) {
    var currentSelectedMenuItem = this.getNextEnabledMenuItem(menuItem) ;
    this.set('currentItemSelected',currentSelectedMenuItem) ;
    if(menuItem) menuItem.resignFirstResponder() ;
    currentSelectedMenuItem.becomeFirstResponder() ;
  },
  
  /** 
    @private 
    
    This function gets called from the Menu Item in order to set the 
    current Selected Menu Item and move the selection
  */
  moveUp: function(menuItem) {
    var currentSelectedMenuItem = this.getPreviousEnabledMenuItem(menuItem) ;
    this.set('currentItemSelected',currentSelectedMenuItem) ;
    if(menuItem) menuItem.resignFirstResponder() ;
    currentSelectedMenuItem.becomeFirstResponder() ;
    return YES ;
  },
  
  /**
    Get the previous Enabled Menu Item which is not a separator
    
    @returns MenuItemView
  */
  getPreviousEnabledMenuItem : function(menuItem) {
    var menuItemViews = this.get('menuItemViews') ;
    if(menuItemViews) {
      var len = menuItemViews.length ;
      var menuIdx = idx = (menuItemViews.indexOf(menuItem) === -1) ? 
        len : menuItemViews.indexOf(menuItem) ;
      var isEnabled = NO ;
      var isSeparator = NO ;
      while((!isEnabled || isSeparator) && --idx !== menuIdx) {
        if(idx === -1) idx = len - 1;
        isEnabled = menuItemViews[idx].get('isEnabled') ;
        var content = menuItemViews[idx].get('content') ;
        if(content) {
          isSeparator = content.get(menuItemViews[idx].get('isSeparatorKey'));
        }
      }
      return menuItemViews[idx];
    }
  },

  /**
    Get the next Enabled Menu Item which is not a separator
    
    @returns MenuItemView
  */
  getNextEnabledMenuItem : function(menuItem) {
    var menuItemViews = this.get('menuItemViews') ;
    if(menuItemViews) {
      var len = menuItemViews.length ;
      var menuIdx = idx = (menuItemViews.indexOf(menuItem) === -1) ? 
        0 : menuItemViews.indexOf(menuItem) ;
      var isEnabled = NO ;
      var isSeparator = NO ;
      while((!isEnabled || isSeparator) && ++idx !== menuIdx) {
        if(idx === len) idx = 0;
        isEnabled = menuItemViews[idx].get('isEnabled') ;
        var content = menuItemViews[idx].get('content') ;
        if(content) {
          isSeparator = content.get(menuItemViews[idx].get('isSeparatorKey'));
        }
      }
      return menuItemViews[idx] ;
    }
  },
  
  /** 
    @private - click away picker. 
    
    Override to pass the event to the parent Menu
    in case the current Menu is a subMenu
    
    @returns Boolean
  */
  modalPaneDidClick: function(evt) {
    var f = this.get("frame");
    var currentSelectedMenuItem = this.get('currentSelectedMenuItem');
    if(currentSelectedMenuItem) {
      var anchor = currentSelectedMenuItem.getAnchor();
      if(anchor) {
        var parentMenu =  anchor.parentMenu();
        if(parentMenu.kindOf(SC.MenuPane)) parentMenu.modalPaneDidClick(evt);
      }
    }
    if(!this.clickInside(f, evt)) {
      this.remove() ;
    }
    return YES;
  },
  
  /** 
    Get the Menu Item based on the key,value passed
    @params {String} key 
    @params {String} value 
    
    @returns SC.MenuItemView
  */
  getMenuItem: function(key,value) {
    var displayItems = this.get('displayItemsArray') ;
    var menuItemViews = this.get('menuItemViews') ;
    if(displayItems && menuItemViews) {
      var idx = displayItems.get(key).indexOf(value);
      if(idx !== -1) return menuItemViews[idx];
      else return null;
    }
    else return null;
  }
  
  
});

SC._menu_fetchKeys = function(k) {
  return this.get(k) ;
};
SC._menu_fetchItem = function(k) {
  if (!k) return null ;
  return this.get ? this.get(k) : this[k] ;
};
