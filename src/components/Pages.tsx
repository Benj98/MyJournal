import { useState, useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';

type Page = {
    id: number;
    content: string;
    timestamp: string;
};

const Pages = () => {
    const [ cookies, setCookies ] = useCookies(['journalPages']);
  
    const initialPages = useMemo(() => {
      const savedPages = cookies.journalPages;
  
      if (!savedPages || savedPages === '{}' || savedPages === '[]') {
        return [];
      }
  
      const isValid = (str: string) => {
        try {
          const parsed = JSON.parse(str);
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      };
  
      if (!isValid(savedPages)) {
        console.error('Invalid savedPages JSON:', savedPages);
        return [];
      }
  
      return JSON.parse(savedPages);
    }, [cookies.journalPages]);
  
    const [ pages, setPages ] = useState<Page[]>(initialPages);
  
    const [ activePageIndex, setActivePageIndex ] = useState<number | null>(null);
    const [ filteredPages, setFilteredPages ] = useState<Page[]>([]);
    const [ selectedDate, setSelectedDate ] = useState<string | null>(null);
  
    const savePagesToCookies = (pages: Page[]) => {
      setCookies('journalPages', JSON.stringify(pages), {path: '/', maxAge: 31536000 });
    }
  
    useEffect(() => {
      savePagesToCookies(pages);
    }, [pages]);
  
    const addPage = () => {
      const newPage = {
        id: Date.now(),
        content: '',
        timestamp: new Date().toISOString(),
      };
  
      console.log(newPage)
  
      const updatedPages = [...pages, newPage];
      setPages(updatedPages);
      setActivePageIndex(updatedPages.length - 1);
  
      const today = new Date().toISOString().split('T')[0];
      if (selectedDate === today || selectedDate === null) {
        setFilteredPages(updatedPages);
      } 
  
      filterPagesByDate(today, true);
      savePagesToCookies(updatedPages);
    };
  
    const deletePage = (id: number) => {
      const newPages = pages.filter((page) => page.id !== id);
      setPages(newPages);
      setFilteredPages(newPages);
      setActivePageIndex(null);
      savePagesToCookies(newPages);
    }
  
    const updatePageContent = (id: number, content: string) => {
      const updatedPages = pages.map((page) => (page.id == id ? { ...page, content } : page));
      setPages(updatedPages);
      savePagesToCookies(updatedPages);
    };
  
    const filterPagesByDate = (date: string, keepActiveIndex = false) => {
      
      if (!keepActiveIndex) {
        setActivePageIndex(null);
      }
  
      setSelectedDate(date);
  
      if (!date) {
        setFilteredPages(pages);
        return;
      }
  
      const filtered = pages.filter((page) => {
        const pageDate = new Date(page.timestamp).toISOString().split('T')[0];
        return pageDate === date;
      })
  
      if (keepActiveIndex) {
        setFilteredPages(filtered);
      }
    }
  
    const isTodaySelected = () => {
      const today = new Date().toISOString().split('T')[0];
      return !selectedDate || selectedDate === today;
    }
  
    const savePage = () => {
      if (activePageIndex !== null) {
        savePagesToCookies(pages);
        
        if(selectedDate) {
          filterPagesByDate(selectedDate, true);
        }
        setActivePageIndex(null);
      }
    }

    return (
        <>
            <div className="journal">

            <input
                className="date-input"
                type="date"
                onChange={(e) => filterPagesByDate(e.target.value)}
            />

            {isTodaySelected() && (
                <button className="add-button" onClick={addPage}>Add new</button>
            )}
        
            {activePageIndex !== null && (
                <>
                <div>            
                    <button
                        className="delete-button"
                        onClick={() => deletePage(pages[activePageIndex].id)}
                    >
                        &#x2715;
                    </button>

                    <button
                        className="save-button"
                        onClick={() => savePage()}
                    >
                        Save
                    </button>

                    <div className="journal-entry">

                        <div className="timestamp">
                            {new Date(pages[activePageIndex].timestamp).toLocaleString()}
                        </div>

                        <textarea
                            className="journal-page"
                            value={pages[activePageIndex]?.content || ''}
                            onChange={(e) => 
                                updatePageContent(pages[activePageIndex].id, e.target.value)
                            }
                        />
                    </div>
                </div>
                </>
            )}
        </div>
        <div className="page-list">
          
          {filteredPages.map((page, index) => (
            
            <button
              key={page.id}
              onClick={() => setActivePageIndex(pages.indexOf(page))}
              className={activePageIndex === pages.indexOf(page) ? 'active' : ''}
            >
              Page {index + 1}
            </button>
          ))}
        </div>
    </>
    )
}

export default Pages