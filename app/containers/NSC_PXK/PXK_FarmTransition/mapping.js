export const mapping = (data, detailsCommands) => {
  let returnArr = [];
  data.forEach(child => {
    const list = child.inventories.map((item, index) => {
      let returnObj = {};
      if (index === 0) {
        const target = {
          planningCodeValidate: child.planningCode,
          planningDivideQuantityValidate: child.planningDivideQuantity,
          planningCode: child.planningCode,
          processingType: child.processingType,
          processingTypeName: child.processingTypeName,
          productNameGeneral: child.productName,
          planningDivideQuantity: child.planningDivideQuantity,
        };
        returnObj = Object.assign(target, item);
      } else {
        returnObj = {
          ...item,
          planningCodeValidate: child.planningCode,
          planningDivideQuantityValidate: child.planningDivideQuantity,
        };
      }

      detailsCommands.forEach(detail => {
        if (
          detail.productCode === returnObj.productCode &&
          detail.slotCode === returnObj.slotCode &&
          detail.locatorId === returnObj.locatorId
        ) {
          returnObj = Object.assign(
            {
              tableData: {
                checked: true,
              },
            },
            returnObj,
          );
        }
      });

      return returnObj;
    });
    returnArr = [...returnArr, ...list];
  });

  return returnArr;
};
