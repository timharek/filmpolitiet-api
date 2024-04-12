import IconArrowRight from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrow-right.tsx";
import IconArrowLeft from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrow-left.tsx";

type PaginationProps = {
  totalPages: number;
  currentPageNo: number;
  currentUrl: URL;
};

export default function Pagination(
  { totalPages, currentPageNo, currentUrl }: PaginationProps,
) {
  const nextPage = totalPages > currentPageNo ? currentPageNo + 1 : false;
  const previousPage = currentPageNo > 1 ? currentPageNo - 1 : false;
  const nextPageUrl = getPageURLString(currentUrl, nextPage);
  const previousPageUrl = getPageURLString(currentUrl, previousPage);

  const getPageNumbers = () => {
    const pagesToShowAroundCurrentNo = 1;
    const pages: (number | string)[] = [];

    pages.push(1);

    if (currentPageNo > pagesToShowAroundCurrentNo + 2) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, currentPageNo - pagesToShowAroundCurrentNo);
      i <= Math.min(totalPages - 1, currentPageNo + pagesToShowAroundCurrentNo);
      i++
    ) {
      pages.push(i);
    }

    if (currentPageNo + pagesToShowAroundCurrentNo + 1 < totalPages) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };
  const pageNumberClass = "px-2 py-1";
  return (
    <div class="px-4 mx-auto max-w-screen-md font-semibold">
      <div class="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        {previousPage &&
          (
            <a
              href={previousPageUrl}
              class="px-2 py-1 rounded bg-white text-black "
              aria-label="Next page"
              title="Next page"
            >
              <IconArrowLeft />
            </a>
          )}
        {getPageNumbers().map((page, index) => (
          <span key={index}>
            {typeof page === "string" || page === currentPageNo
              ? (
                <span
                  class={page === currentPageNo
                    ? `rounded bg-white text-black ${pageNumberClass}`
                    : ""}
                >
                  {page}
                </span>
              )
              : (
                <a
                  href={getPageURLString(currentUrl, page)}
                  class={pageNumberClass}
                >
                  {page}
                </a>
              )}
          </span>
        ))}
        {nextPage &&
          (
            <a
              href={nextPageUrl}
              class="px-2 py-1 rounded bg-white text-black "
              aria-label="Previous page"
              title="Previous page"
            >
              <IconArrowRight />
            </a>
          )}
      </div>
    </div>
  );
}

function getPageURLString(url: URL, newPage: number | false) {
  if (!newPage) {
    return url.toString();
  }
  url.searchParams.set("page", String(newPage));
  return url.toString();
}
