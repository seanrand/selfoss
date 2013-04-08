selfoss.shortcuts = {


    /**
     * init shortcuts
     */
    init: function() { 
        // next
        $(document).bind('keydown', 'space', function() {
            var selected = $('.entry.selected');
            if(selected.length>0 && selected.find('.entry-content').is(':visible')==false) {
                selected.find('.entry-title').click();
            } else {
                selfoss.shortcuts.nextprev('next', true);
            }
            return false;
        });
        $(document).bind('keydown', 'n', function() { selfoss.shortcuts.nextprev('next', false); return false; });
        $(document).bind('keydown', 'right', function() {
            selfoss.shortcuts.entrynav('next');
            return false;
        });
        $(document).bind('keydown', 'j', function() { selfoss.shortcuts.nextprev('next', true); return false; });
        
        // prev
        $(document).bind('keydown', 'shift+space', function() { selfoss.shortcuts.nextprev('prev', true); return false; });
        $(document).bind('keydown', 'p', function() { selfoss.shortcuts.nextprev('prev', false); return false; });
        $(document).bind('keydown', 'left', function() { 
            selfoss.shortcuts.entrynav('prev');
            return false;
        });
        $(document).bind('keydown', 'k', function() { selfoss.shortcuts.nextprev('prev', true); return false; });
        
        // star/unstar
        $(document).bind('keydown', 's', function() {
            $('.entry.selected .entry-starr').click();
        });
        
        // mark/unmark
        $(document).bind('keydown', 'm', function() {
            $('.entry.selected .entry-unread').click();
        });
        
        // open/close entry
        // can be used in combination with left and right key
        $(document).bind('keydown', 'o', function() {
            $('.entry.selected').find('h2').click();
        });
        
        // open target
        $(document).bind('keydown', 'v', function() {
            window.open($('.entry.selected .entry-source').attr('href'));
        });
        
        // Reload the current view
        $(document).bind('keydown', 'r', function() {
            selfoss.reloadList();
        });
        
        // mark all as read
        $(document).bind('keydown', 'ctrl+m', function() {
            $('#nav-mark').click();
        });

        // throw (mark as read & open next)
        $(document).bind('keydown', 't', function() {
            $('.entry.selected.unread .entry-unread').click();
            selfoss.shortcuts.nextprev('next', true);
            return false;
        });

        // throw (mark as read & open previous)
        $(document).bind('keydown', 'Shift+t', function() {
            $('.entry.selected.unread .entry-unread').click();
            selfoss.shortcuts.nextprev('prev', true);
            return false;
        });
    },
    
    
    /**
     * get next/prev item
     * @param direction
     */
    nextprev: function(direction, open) {
        if(typeof direction == "undefined" || (direction!="next" && direction!="prev"))
            direction = "next";

        // select current        
        var old = $('.entry.selected');
        
        // select next/prev and save it to "current"
        if(direction=="next") {
            if(old.length==0) {
                current = $('.entry:eq(0)');
            } else {
                current = old.next().length==0 ? old : old.next();
            }
            
        } else {
            if(old.length==0) {
                return;
            }
            else {
                if (open && old.next().is('.stream-empty, .stream-more')) {
                    current = old.has('.entry-content:hidden').length ? old : old.prev();
                } else {
                    current = old.prev().length==0 ? old : old.prev();
                }
            }
        }

        // remove active
        old.find('.entry-content').hide();
        old.find('.entry-toolbar').hide();

        // load more
        if(current.hasClass('stream-more') && !current.hasClass('loading'))
                current.click();

        // open?
        if(open) {
            var content = current.find('.entry-content');
            // load images not on mobile devices
            if(selfoss.isMobile()==false)
                content.lazyLoadImages();
            // anonymize
            selfoss.anonymize(content);
            content.show();
            current.find('.entry-toolbar').show();
            selfoss.events.entriesToolbar(current);
            // automark as read
            if($('#config').data('auto_mark_as_read')=="1" && current.hasClass('unread'))
                current.find('.entry-unread').click();
        }

        selfoss.shortcuts.autoscroll(old, current);

        if (!(current.hasClass('stream-more') || current.hasClass('stream-empty'))) {
            old.removeClass('selected');
            current.addClass('selected');
        }
    },
    
    
    /**
     * autoscroll
     */
    autoscroll: function(prev, next) {
        var viewportHeight = $(window).height();
        var viewportScrollTop = $(window).scrollTop();

        if ($('body').hasClass('top_align_on_move')) {
            // scroll the currently opened item to the top of the screen

            var streamDiv = $('.stream-empty, .stream-more');
            if(streamDiv.length == 1) {

                // calculate and set height of streamDiv so that the item can scroll to the top
                var padding = streamDiv.cssUnit('padding-top')[0] + $('#content').cssUnit('padding-bottom')[0];
                var streamDivHeight = viewportHeight - streamDiv.position().top - padding;
                if (next.hasClass('stream-empty') || next.hasClass('stream-more')) {
                    streamDiv.height(streamDivHeight + prev.position().top);
                    $(window).scrollTop(prev.position().top);
                } else {
                    streamDiv.height(streamDivHeight + next.position().top);
                    $(window).scrollTop(next.position().top);
                }
            }
        } else {
            // scroll down
            if(viewportScrollTop + viewportHeight < next.position().top + next.height() + 80) {
                if(next.height() > viewportHeight) {
                    $(window).scrollTop(next.position().top);
                } else {
                    var marginTop = (viewportHeight-next.height())/2;
                    var scrollTop = next.position().top-marginTop;
                    $(window).scrollTop(scrollTop);
                }
            }

            // scroll up
            if(next.position().top <= viewportScrollTop) {
                $(window).scrollTop(next.position().top);
            }
        }
    },
    
    
    /**
     * entry navigation (next/prev) with keys
     * @param direction
     */
    entrynav: function(direction) {
        if(typeof direction == "undefined" || (direction!="next" && direction!="prev"))
            direction = "next";
        
        var content = $('.entry-content').is(':visible');
            selfoss.shortcuts.nextprev(direction, content);
    }
};
