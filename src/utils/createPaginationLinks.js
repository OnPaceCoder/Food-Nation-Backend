const { URL } = require('url');


const createPaginationLinks = (originalUrl, currentPage, totalPages, limit) => {
    const createPaginationUrl = (pageNum) => {
        const url = new URL(originalUrl, "http://ifn666.12004804.com");
        url.searchParams.set('page', pageNum);
        url.searchParams.set('limit', limit);
        return url.toString().replace("http://ifn666.12004804.com", '');
    };

    const paginationLinks = {};
    paginationLinks.first = createPaginationUrl(1);
    paginationLinks.previous = '';
    paginationLinks.next = '';
    paginationLinks.last = createPaginationUrl(totalPages);

    if (currentPage > 1) {
        paginationLinks.previous = createPaginationUrl(currentPage - 1);
    }

    if (currentPage < totalPages) {
        paginationLinks.next = createPaginationUrl(currentPage + 1);
    }

    return paginationLinks;
};

module.exports = { createPaginationLinks };
