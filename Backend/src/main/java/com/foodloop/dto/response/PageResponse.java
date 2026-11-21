package com.foodloop.dto.response;

import org.springframework.data.domain.Page;
import java.util.List;
import java.util.function.Function;

/**
 * Generic paginated response wrapper.
 */
public class PageResponse<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public PageResponse() {}

    public static <E, R> PageResponse<R> from(Page<E> springPage, Function<E, R> mapper) {
        PageResponse<R> r = new PageResponse<>();
        r.content = springPage.getContent().stream().map(mapper).toList();
        r.page = springPage.getNumber();
        r.size = springPage.getSize();
        r.totalElements = springPage.getTotalElements();
        r.totalPages = springPage.getTotalPages();
        r.last = springPage.isLast();
        return r;
    }

    public List<T> getContent()     { return content; }
    public int getPage()            { return page; }
    public int getSize()            { return size; }
    public long getTotalElements()  { return totalElements; }
    public int getTotalPages()      { return totalPages; }
    public boolean isLast()         { return last; }
}
