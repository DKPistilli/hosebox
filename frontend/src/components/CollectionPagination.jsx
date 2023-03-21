import { Pagination } from 'antd';
import './CollectionPagination.css';

function CollectionPagination(props) {
    const { currentPage,
            setCurrentPage,
            totalCards,
            cardsPerPage } = props;

    const handleChange = (page, pageSize) => {
        setCurrentPage(page);
    }

    return (
        <div className="pagination">
            <Pagination
                style={{textAlign: "right", marginBottom: "8px"}}
                current={currentPage}
                total={totalCards}
                pageSize={cardsPerPage}
                onChange={handleChange}
                size={"small"}
            />
        </div>
    )
}

export default CollectionPagination