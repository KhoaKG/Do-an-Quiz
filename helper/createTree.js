let count = 0
const createTree = (arr, parentid = "")=>{
    const tree = []
        arr.forEach((item) =>{
            if(item.parent_id === parentid){
                count++
                const newItem = item;
                newItem.index = count
                const children = createTree(arr, item.id);
                if(children.length > 0){
                    newItem. children = children;
                }
                tree. push(newItem) ;
            }
        }) ;
        return tree;
}
module.exports.tree = (arr, parentid = "")=>{
    count = 0
    const tree = createTree(arr, parentid = "")
    return tree
}
