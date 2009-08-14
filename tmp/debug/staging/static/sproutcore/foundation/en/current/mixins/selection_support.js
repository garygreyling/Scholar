// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/**
  @namespace
  
  Implements common selection management properties for controllers.
  
  Selection can be managed by any controller in your applications.  This
  mixin provides some common management features you might want such as
  disabling selection, or restricting empty or multiple selections.
  
  To use this mixin, simply add it to any controller you want to manage 
  selection and call updateSelectionAfterContentChange()
  whenever your source content changes.  You can also override the properties
  defined below to configure how the selection management will treat your 
  content.
  
  This mixin assumes the arrangedObjects property will return an SC.Array of 
  content you want the selection to reflect.
  
  Add this mixin to any controller you want to manage selection.  It is 
  already applied to the CollectionController and ArrayController.
  
  @author Charles Jolley
  @author Erich Ocean
  @version 1.0
  @since 0.9
*/
SC.SelectionSupport = {
  
  // ..........................................................
  // PROPERTIES
  // 
  
  hasSelectionSupport: YES,
  
  /**
    If YES, selection is allowed. Default is YES.
    
    @type Boolean
  */
  allowsSelection: YES,
  
  /**
    If YES, multiple selection is allowed. Default is YES.
    
    @type Boolean
  */
  allowsMultipleSelection: YES,
  
  /**
    If YES, allow empty selection Default is YES.
    
    @type Boolean
  */
  allowsEmptySelection: YES,
  
  /**
    This is the current selection.  You can make this selection and another
    controller's selection work in concert by binding them together. You
    generally have a master selection that relays changes TO all the others.
    
    @property
    @type SC.SelectionSet
  */
  selection: function(key, value) {
    var content, empty;
    
    if (value !== undefined) {
      
      // are we even allowing selection at all?  Also, must be enumerable
      if (this.get('allowsSelection') && value && value.isEnumerable) {
        
        // ok, new decide if the *type* of selection is allowed...
        switch (value.get('length')) {
          
          // check to see if we're attempting to set an empty array
          // if that's not allowed, set to the first available item in 
          // arrangedObjects
          case 0:
            empty   = this.get('allowsEmptySelection');
            content = this.get('arrangedObjects');
            if (empty && content && content.get('length')>0) {
                value = SC.SelectionSet.create().add(content, 0).freeze();
            } else value = null ;
            break;
            
          // single items are always allows
          case 1:
            break;

          // fall through for >= 2, only allow if configured for multi-select
          default:
            if (!this.get('allowsMultipleSelection')) value = null;
            break;
        }
      } else value = null;
      
      // always make selection into something then save
      if (!value) value = SC.SelectionSet.EMPTY;
      this._scsel_selection = value;
      
    // read only mode
    } else return this._scsel_selection ;
    
  }.property('arrangedObjects', 'allowsEmptySelection', 
      'allowsMultipleSelection', 'allowsSelection').cacheable(),
  
  /**
    YES if the receiver currently has a non-zero selection.
    
    @property Boolean
  */
  hasSelection: function() {
    var sel = this.get('selection') ;
    return !!sel && (sel.get('length') > 0) ;
  }.property('selection').cacheable(),
  
  // ..........................................................
  // METHODS
  // 

  /**
    Selects the passed objects in your content.  If you set "extend" to YES,
    then this will attempt to extend your selection as well.
  
    @param {SC.Enumerable} objects objects to select
    @param {Boolean} extend optionally set to YES to extend selection
    @returns {Object} receiver
  */
  selectObjects: function(objects, extend) {

    // handle passing an empty array
    if (!objects || objects.get('length')===0) {
      if (!extend) this.set('selection', SC.SelectionSet.EMPTY);
      return this;
    }
    
    var sel = this.get('selection');
    if (extend && sel) sel = sel.copy();
    else sel = SC.SelectionSet.create();
    
    sel.addObjects(objects).freeze();
    this.set('selection', sel);
    return this ;
  },
  
  /**
    Selects a single passed object in your content.  If you set "extend" to 
    YES then this will attempt to extend your selection as well.
    
    @param {Object} object object to select
    @param {Boolean} extend optionally set to YES to extend selection
    @returns {Object} receiver
  */
  selectObject: function(object, extend) {
    if (object === null) {
      if (!extend) this.set('selection', null);
      return this ;
      
    } else return this.selectObjects([object], extend);
  },    

  /**
    Deselects the passed objects in your content.
    
    @param {SC.Enumerable} objects objects to select
    @returns {Object} receiver
  */
  deselectObjects: function(objects) {

    if (!objects || objects.get('length')===0) return this; // nothing to do
    
    var sel = this.get('selection');
    if (!sel || sel.get('length')===0) return this; // nothing to do

    // find index for each and remove it
    sel = sel.copy().removeObjects(objects).freeze();
    this.set('selection', sel.freeze());
    return this ;
  },
  
  /**
    Deselects the passed object in your content.
    
    @param {SC.Object} object single object to select
    @returns {Object} receiver
  */
  deselectObject: function(object) {
    if (!object) return this; // nothing to do
    else return this.deselectObjects([object]);
  },
  
  /** 
    Call this method whenever your source content changes to ensure the 
    selection always remains up-to-date and valid.
  */
  updateSelectionAfterContentChange: function() {
    
    var content = this.get('arrangedObjects'),
        sel     = this.get('selection'),
        indexes, len, max, ret;

    if (!sel) sel = SC.SelectionSet.EMPTY;
    
    // if selection is not allowed, just force to be empty.
    if (!this.get('allowsSelection') && sel.get('length')>0) {
      ret = SC.SelectionSet.EMPTY;
      
      
    // selection is allowed, make sure it is valid
    } else {
      
      // remove from the sel any items selected beyond the length of the new
      // arrangedObjects
      indexes = content ? sel.indexSetForSource(content) : null;
      len     = content ? content.get('length') : 0;
      max     = indexes ? indexes.get('max') : 0;
      if (max > len) ret = sel.copy().constrain(content).freeze();
      
    }
  
    if (ret) this.set('selection', ret);
    return this ;
  }
    
};
