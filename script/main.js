(function() {

    var isSearching = false;

    var $artistSearchForm = null;
    var $artistSearchResults = null;

    var MaxResults = 20;

    $(function() {
        insertSearchForm();

        $artistSearchForm.on('submit', function(event) {
            event.preventDefault();
            handleSearchSubmit();
        });
    
        $('.yehaw-artist-search-results-close-btn').on('click', function() {
            $artistSearchResults.removeClass('visible');
        });
    
        $artistSearchResults.on('click', function(event) {
            if($(event.target).hasClass('yehaw-artist-search-results'))
            {
                $artistSearchResults.removeClass('visible');
            }
        })
    });

    function insertSearchForm()
    {
        // Insert the DOM content
        $('#block-5d051fb097e05400013f9d8e').after(
            '<form class="yehaw-artist-search-form">' +
                '<input id="artist-search-term" name="artist-search-term" aria-label="Search Term" class="yehaw-artist-search-input" type="text">' +
                '<button class="yehaw-artist-search-btn yehaw-artist-search-form-btn">Search</button>' +
            '</form>' +
            
            '<div class="yehaw-artist-search-results">' +
                '<div class="yehaw-artist-search-results-modal">' +
                    '<div class="yehaw-artist-search-results-modal-inner">' +
                        '<div class="yehaw-artist-search-results-modal-header">' +
                            '<h2>Search results for "<span id="yehaw-artist-search-results-term"></span>"</h2>' +
                            '<button class="yehaw-artist-search-btn yehaw-artist-search-results-close-btn">Close</button>' +
                        '</div>' +
                        '<div class="yehaw-artist-search-results-modal-content">' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        // Cache the DOM references
        $artistSearchForm = $('.yehaw-artist-search-form');
        $artistSearchResults = $('.yehaw-artist-search-results');
    }
    
    function handleSearchSubmit()
    {
        var searchTerm = $('#artist-search-term').val();

        if(searchTerm === '')
        {
            return;
        }

        if(isSearching)
        {
            return;
        }

        isSearching = true;
        $artistSearchForm.addClass('loading');

        doSearch(searchTerm, 1, function(response) {
            $('#yehaw-artist-search-results-term').text(searchTerm);
            $('.yehaw-artist-search-results-modal-content').empty();
            onSearchSuccess(response);
        });
    }
    
    function doSearch(searchTerm, startIndex, onSearchSuccess)
    {
        $.ajax({
            url: "https://www.googleapis.com/customsearch/v1/siterestrict",
            dataType: "jsonp",
            data: {
                key: 'AIzaSyCei4ypSxdvj985b9Qr67Lq6oUDNDMa-Ss',
                cx: '006455971487473204572:zuueohon068',
                q: searchTerm,
                start: startIndex
            },
            success: onSearchSuccess
        });
    }
    
    function onSearchSuccess(response)
    {
        isSearching = false;
        $artistSearchForm.removeClass('loading');

        var totalResults = parseInt(response.searchInformation.totalResults, 10);
        var searchTerm = response.queries.request[0].searchTerms;
        var startIndex = response.queries.request[0].startIndex;
    
        displayResults(searchTerm, response.items, startIndex, totalResults);
    }
    
    function displayResults(searchTerm, items, currStartIndex, totalResults)
    {
        var $results = $('.yehaw-artist-search-results-modal-content');
    
        if(!items || items.length === 0)
        {
            $results.append('<span>No results found</span>');
        }
        else
        {
            items.forEach(function(item) {
    
                var title = item.title;
                title = title.replace(' — yəhaw̓', '');
        
                $results.append('<div class="yehaw-artist-search-result">' +
                    '<a href="' + item.link + '">' + title + '</a>' +
                    '<span class="yehaw-artist-search-result-snippet">' + item.snippet + '</span>' +
                '</div>');
        
            });
        }
    
        if(!$results.hasClass('visible'))
        {
            $artistSearchResults.addClass('visible');
            $artistSearchResults.height($('body').height())
        }
    
        var nextPageStartIndex = currStartIndex + 10;
        if(nextPageStartIndex < totalResults && nextPageStartIndex < MaxResults)
        {
            doSearch(searchTerm, nextPageStartIndex, onSearchSuccess);
        }
    }

})();