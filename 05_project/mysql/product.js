module.exports = {
  // todo 목록
  todoList: {
    query: `select * from tbl_todo`,
  },
  // todo 삭제
  todoDelete: {
    query: `delete from tbl_todo where id = ?`,
  },

  //
  productList: {
    query: `select t1.*, t2.path, t3.category1, t3.category2, t3.category3
            from   t_product t1, t_image t2, t_category t3
            where  t1.id = t2.product_id
            and    t2.type = 1
            and    t1.category_id = t3.id`,
  },
  //
  productList2: {
    query: `select t3.*, t4.path
            from   (select t1.*, t2.category1, t2.category2, t2.category3
                    from   t_product t1, t_category t2
                    where  t1.category_id = t2.id) t3
                    left join (select * from t_image where type = 1) t4
                           on t3.id = t4.product_id`,
  },
  //
  productDetail: {
    query: `SELECT   t1.*, t2.path, t3.category1, t3.category2, t3.category3, t2.type
            FROM     t_product t1
            LEFT OUTER JOIN t_image t2 ON t1.id = t2.product_id AND t2.type in (1, 3)
            LEFT OUTER JOIN t_category t3 ON t1.category_id = t3.id
            WHERE    t1.id = ?
            ORDER BY t2.type DESC
            LIMIT    1`,
  },
  //
  productMainImages: {
    query: `select *
            from   t_image
            where  product_id = ? and type = 2`,
  },
  // 상품 등록
  productInsert: {
    query: `insert into t_product set ?`,
  },
  // 상품이미지 등록
  productImageInsert: {
    query: `insert into t_image set ?`,
  },
  // 이미지 리스트
  imageList: {
    query: `select *
            from   t_image
            where  product_id = ?`,
  },
  // 상품이미지 삭제
  imageDelete: {
    query: `delete from t_image
            where id = ?`,
  },
  // 상품 삭제
  productDelete: {
    query: `delete from t_product
            where id = ?`,
  },
  // 카테고리 목록
  categoryList: {
    query: `select *
            from   t_category`,
  },
  // 카테고리 생성
  categoryInsert: {
    query: `insert into t_category set ?`,
  },
  // 판매자 목록
  sellerList: {
    query: `select *
            from   t_seller`,
  },
  // 회원가입
  signUp: {
    query: `insert into t_user set ?
            on duplicate key update ?`,
  },
};
