const AG_HEADER_MIN_HEIGHT = 25;

/**
 * Resize Header Height
 * Call this in onGridReady and onGridSizeChanged
 * Use together with agGridCustomStyle.css
 * @param event
 */
export function agAutosizeHeaders(event) {
  if (event.finished !== false) {
    event.api.setHeaderHeight(AG_HEADER_MIN_HEIGHT);
    const headerCells = document.querySelectorAll('.ag-header-cell-label');
    let minHeight = AG_HEADER_MIN_HEIGHT;
    headerCells.forEach(cell => {
      minHeight = Math.max(minHeight, cell.scrollHeight);
    });
    event.api.setHeaderHeight(minHeight + 16);
  }
}
