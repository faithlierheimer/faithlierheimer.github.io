export const formatDateMonthYear = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month}, ${year}`;
}

export const formatDateMonthDayYear = (dateString) => {
    const date = new Date(dateString + 'T12:00:00');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.toLocaleString('en-US', { day: 'numeric' });
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

export const categoryLabels = {
    "Personal": "personal",
    "Pop Culture": "pop-culture",
    "Work": "work",
    "Sunday Lattes": "sunday-lattes",
    "Patreon Post": "patreon-post",
}

export const sortByMostRecent = (arr) => {
  return [...arr].sort((a, b) => {
        const defaultDate = "1967-06-07";
        new Date(b.publishDate || defaultDate) - new Date(a.publishDate || defaultDate)
    });
}