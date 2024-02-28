def extract_link_and_url_metadata_direct(url, query):
    parsed_url = urlparse(url)
    url_path_keywords = set(parsed_url.path.lower().strip("/").replace("-", " ").replace("_", " ").split("/"))
    
    # URL depth calculation
    url_depth = len(url_path_keywords)
    
    # Query-URL keyword match calculation
    query_keywords = set(query.lower().split())
    keyword_match = len(query_keywords & url_path_keywords)

    return {
        "url": url,
        "url_depth": url_depth,
        "keyword_match": keyword_match,
        "query": query
    }

def extract_table_structure_metadata_direct(tables, query):
    if not tables or (len(tables) == 1 and len(tables[0]) > 0):
        return None  # Skip if tables are empty or only contain headers

    metadata_list = []
    query_keywords = set(query.lower().split())

    # Assuming the first list in 'tables' is the header
    headers = tables[0]
    header_matches = sum(1 for header in headers if any(keyword in header.lower() for keyword in query_keywords))

    # All subsequent lists in 'tables' are considered as data rows
    data_rows = tables[1:]  # Exclude the header row
    row_count = len(data_rows)
    col_count = len(headers) if headers else 0

    numeric_cols = sum(1 for cell in data_rows[0] if cell.replace('.', '', 1).isdigit()) if data_rows else 0
    non_numeric_cols = col_count - numeric_cols

    metadata_list.append({
        'headers': ', '.join(headers),
        'header_matches': header_matches,
        'row_count': row_count,
        'col_count': col_count,
        'numeric_cols': numeric_cols,
        'non_numeric_cols': non_numeric_cols,
        'query': query
    })

    return metadata_list
