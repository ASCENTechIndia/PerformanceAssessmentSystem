const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");

async function getTaskTypeDropdown(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const query = `select tasktype_id, tasktype_name from view_TASKTYPE_list`;

    const result = await connection.execute(
      query,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getTaskTypeDropdown error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getParentTaskDropdown(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const query = `select task_id, task_title from view_task_list`;

    const result = await connection.execute(
      query,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getParentTaskDropdown error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function AOPT_TASK_INSUPD(req, res) {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN
      AOPT_TASK_INSUPD
        (
            :IN_MODE,
            :IN_TASK_ID,
            :IN_TASKTYPE_ID,
            :IN_TASK_TITLE,
            :IN_TASK_DESCRIPTION,
            :IN_TASK_COMPLETIONCRITERIA,
            :IN_TASK_EXCEPCTEDDAYS,
            :IN_TASK_PARENTID,
            :IN_TASK_ISACTIVE,
            :IN_USERID,
            :OUT_ERRORCODE,
            :OUT_ERRORMSG
        );
      END;`;

    const bind = {
      IN_MODE: payload.IN_MODE,
      IN_TASK_ID:
        payload.IN_TASK_ID === null || payload.IN_TASK_ID === undefined
          ? 0
          : Number(payload.IN_TASK_ID),
      IN_TASKTYPE_ID: Number(payload.IN_TASKTYPE_ID),
      IN_TASK_TITLE: payload.IN_TASK_TITLE,
      IN_TASK_DESCRIPTION: payload.IN_TASK_DESCRIPTION ?? "",
      IN_TASK_COMPLETIONCRITERIA: payload.IN_TASK_COMPLETIONCRITERIA ?? "",
      IN_TASK_EXCEPCTEDDAYS:
        payload.IN_TASK_EXCEPCTEDDAYS === null ||
        payload.IN_TASK_EXCEPCTEDDAYS === undefined
          ? 0
          : Number(payload.IN_TASK_EXCEPCTEDDAYS),
      IN_TASK_PARENTID:
        payload.IN_TASK_PARENTID === null ||
        payload.IN_TASK_PARENTID === undefined
          ? 0
          : Number(payload.IN_TASK_PARENTID),
      IN_TASK_ISACTIVE: payload.IN_TASK_ISACTIVE,
      IN_USERID: payload.IN_USERID,
      OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORMSG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      errorCode: result.outBinds.OUT_ERRORCODE,
      errorMessage: result.outBinds.OUT_ERRORMSG,
    });
  } catch (error) {
    console.error("AOPT_TASK_INSUPD error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getUlbDropdown(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const query = `select ulbid, ulb_name from view_ulb_list`;

    const result = await connection.execute(
      query,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getUlbDropdown error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function AOPT_TASKSTATUS_INSUPD(req, res) {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN
      AOPT_TASKSTATUS_INSUPD
        (
            :IN_MODE,
            :IN_TASKSTATUS_ID,
            :IN_TASKSTATUS_CODE,
            :IN_TASKSTATUS_NAME,
            :IN_TASKSTATUS_BGCOLOR,
            :IN_TASKSTATUS_FORECOLOR,
            :IN_DISPLAYORDER,
            :IN_FINALSTATUS,
            :IN_ISACTIVE,
            :IN_USERID,
            :OUT_ERRORCODE,
            :OUT_ERRORMSG
        );
      END;`;

    const bind = {
      IN_MODE: payload.IN_MODE,
      IN_TASKSTATUS_ID:
        payload.IN_TASKSTATUS_ID === null ||
        payload.IN_TASKSTATUS_ID === undefined
          ? 0
          : Number(payload.IN_TASKSTATUS_ID),
      IN_TASKSTATUS_CODE: payload.IN_TASKSTATUS_CODE,
      IN_TASKSTATUS_NAME: payload.IN_TASKSTATUS_NAME,
      IN_TASKSTATUS_BGCOLOR: payload.IN_TASKSTATUS_BGCOLOR ?? null,
      IN_TASKSTATUS_FORECOLOR: payload.IN_TASKSTATUS_FORECOLOR ?? null,
      IN_DISPLAYORDER:
        payload.IN_DISPLAYORDER === null ||
        payload.IN_DISPLAYORDER === undefined
          ? 0
          : Number(payload.IN_DISPLAYORDER),
      IN_FINALSTATUS:
        payload.IN_FINALSTATUS === null || payload.IN_FINALSTATUS === undefined
          ? 0
          : Number(payload.IN_FINALSTATUS),
      IN_ISACTIVE:
        payload.IN_ISACTIVE === null || payload.IN_ISACTIVE === undefined
          ? 1
          : Number(payload.IN_ISACTIVE),
      IN_USERID: payload.IN_USERID,
      OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORMSG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      errorCode: result.outBinds.OUT_ERRORCODE,
      errorMessage: result.outBinds.OUT_ERRORMSG,
    });
  } catch (error) {
    console.error("AOPT_TASKSTATUS_INSUPD error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getTaskList(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const userId = req.query.userId;
    if (!userId) {
      return res.json({ success: false, errorMessage: "User Id is required" });
    }

    const query = `SELECT a.task_id, a.task_title, a.excepcteddays, a.parentid, a.isactive,
       a.insdt, a.tasktype, a.statusname, a.statusid, a.bgcolor, a.forecolor
      FROM view_task_list a where insby=:userId`;

    const result = await connection.execute(
      query,
      {userId: userId},
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getTaskList error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getStatusConfigList(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const query = `
      SELECT a.statusid, a.statuscode, a.statusname, a.bgcolor, a.forecolor,
             a.displayorder, a.finalstatus, a.isactive, a.insdt, a.insby
      FROM view_taskstatus_list a
      ORDER BY a.displayorder ASC
    `;

    const result = await connection.execute(
      query,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getStatusConfigList error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getEmployeeMappingList(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const query = `
      SELECT a.emp_id, a.emp_name, a.deptid, a.dept_name, a.desnid,
             a.desi_name, a.reportingto, a.reporting_name, a.isactive,
             a.insdt, a.insby, a.updt, a.upby
      FROM view_employee_reporting_list a
    `;

    const result = await connection.execute(
      query,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getEmployeeMappingList error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function AOPT_TASKASSIGNMENT_INSUPD(req, res) {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN
      AOPT_TASKASSIGNMENT_INSUPD
        (
            :IN_MODE,              
            :IN_TASKASSIGNMENT_ID, 
            :IN_TASKID,            
            :IN_DEPTID,            
            :IN_ASSIGNEDBY,        
            :IN_ASSIGNEDTO,        
            :IN_ASSIGNEDDATE,      
            :IN_STARTDATE,         
            :IN_DUEDATE,           
            :IN_STATUSID,          
            :IN_PRIORITY,          
            :IN_FINISHEDDATE,      
            :IN_COMPLETEDDATE,     
            :IN_ISACTIVE,          
            :IN_ACTIONREMARK,      
            :IN_meetingreference,
            :IN_USERID,            
            :OUT_ERRORCODE,        
            :OUT_ERRORMSG
        );
      END;`;

    const bind = {
      IN_MODE: Number(payload.IN_MODE),

      // Handles null or number
      IN_TASKASSIGNMENT_ID:
        payload.IN_TASKASSIGNMENT_ID === null ||
        payload.IN_TASKASSIGNMENT_ID === undefined ||
        payload.IN_TASKASSIGNMENT_ID === ""
          ? null
          : Number(payload.IN_TASKASSIGNMENT_ID),

      IN_TASKID: Number(payload.IN_TASKID),
      IN_DEPTID: Number(payload.IN_DEPTID),
      IN_ASSIGNEDBY: Number(payload.IN_ASSIGNEDBY),
      IN_ASSIGNEDTO: Number(payload.IN_ASSIGNEDTO),

      IN_ASSIGNEDDATE: payload.IN_ASSIGNEDDATE,
      IN_STARTDATE: payload.IN_STARTDATE,
      IN_DUEDATE: payload.IN_DUEDATE,

      IN_STATUSID: Number(payload.IN_STATUSID),
      IN_PRIORITY: payload.IN_PRIORITY,

      IN_FINISHEDDATE: payload.IN_FINISHEDDATE || null,
      IN_COMPLETEDDATE: payload.IN_COMPLETEDDATE || null,

      IN_ISACTIVE: payload.IN_ISACTIVE,
      IN_ACTIONREMARK: payload.IN_ACTIONREMARK,
      IN_meetingreference: payload.IN_meetingreference,
      IN_USERID: payload.IN_USERID,

      OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORMSG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      errorCode: result.outBinds.OUT_ERRORCODE,
      errorMessage: result.outBinds.OUT_ERRORMSG,
    });
  } catch (error) {
    console.error("AOPT_TASKASSIGNMENT_INSUPD error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getEmpDropdown(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const { reportingId, deptId, ulbId } = req.query;
    if (!reportingId || !deptId || !ulbId) {
      return res.json({
        success: false,
        errorMessage: "Reporting Id or Dept Id or UlbId is missing",
      });
    }

    const query = `
      SELECT employee_id, employee_name 
      FROM view_employee_assignto_list 
      WHERE reportingto_id = :reportingId
      AND deptid = :deptId 
      AND ulbid = :ulbId
    `;

    const bind = {
      reportingId: Number(reportingId),
      deptId: Number(deptId),
      ulbId: Number(ulbId),
    };

    const result = await connection.execute(query, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getEmpDropdown error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getStatusDropdown(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const query = `
      SELECT statusid, statuscode, statusname 
      FROM view_taskstatus_list
      ORDER BY statusid ASC
    `;

    const result = await connection.execute(
      query,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getStatusDropdown error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getMyTaskList(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const { empId } = req.query;
    if (!empId) {
      return res.json({
        success: false,
        errorMessage: "Employee Id is required",
      });
    }

    const query = `
      SELECT * FROM view_mytask_list 
      WHERE assignedto = :empId
    `;

    const bind = {
      empId: Number(empId),
    };

    const result = await connection.execute(query, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getMyTaskList error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function AOPT_TASK_PROGRESS_upd(req, res) {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN
      AOPT_TASK_PROGRESS_upd
        (
            :IN_TASKASSIGNID,       
            :IN_STATUSID,           
            :IN_ACTIONBY,               
            :IN_userid,             
            :IN_COMMENT,            
            :IN_FILENAME,           
            :IN_FILEDOC,            
            :IN_FILETYPE,           
            :OUT_PROGRESSID,        
            :OUT_ERRORCODE,         
            :OUT_ERRORMSG
        );
      END;`;

    const bind = {
      IN_TASKASSIGNID: Number(payload.IN_TASKASSIGNID),
      IN_STATUSID: Number(payload.IN_STATUSID),
      IN_ACTIONBY: Number(payload.IN_ACTIONBY),
      IN_userid: payload.IN_userid,
      IN_COMMENT: payload.IN_COMMENT,

      // Optional Attachment fields
      IN_FILENAME: payload.IN_FILENAME || null,
      IN_FILEDOC: payload.IN_FILEDOC
        ? payload.IN_FILEDOC.replace(/^data:.*?;base64,/, "").replace(/\s/g, "")
        : null, // Passing base64 string directly to CLOB
      IN_FILETYPE: payload.IN_FILETYPE || null,

      // Output parameters
      OUT_PROGRESSID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORMSG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      progressId: result.outBinds.OUT_PROGRESSID,
      errorCode: result.outBinds.OUT_ERRORCODE,
      errorMessage: result.outBinds.OUT_ERRORMSG,
    });
  } catch (error) {
    console.error("AOPT_TASK_PROGRESS_upd error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function getTaskStatusList(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const { taskAssignedId } = req.query;
    if (!taskAssignedId) {
      return res.json({
        success: false,
        errorMessage: "Task assigned Id is missing",
      });
    }

    const query = `
      SELECT * FROM view_task_progress_list 
      WHERE taskassignid = :taskAssignedId
    `;

    const bind = {
      taskAssignedId: Number(taskAssignedId),
    };

    const result = await connection.execute(query, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getTaskStatusList error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

async function lobToBase64(lob) {
  if (!lob) return null;

  return new Promise((resolve, reject) => {
    const chunks = [];
    const isClob = lob.type === oracledb.CLOB;

    if (isClob) lob.setEncoding("utf8"); // CLOB -> string chunks

    lob.on("data", (chunk) => chunks.push(chunk));

    lob.on("end", () => {
      const text = isClob
        ? chunks.join("")
        : Buffer.concat(chunks).toString("utf8"); // BLOB holding base64 text

      resolve(text.replace(/\s/g, "")); // remove any line breaks
    });

    lob.on("error", reject);
  });
}

async function getAttachmentDetails(req, res) {
  let connection;
  try {
    connection = await getConnection();

    const { attachmentId, progressId } = req.query;
    if (!attachmentId || !progressId) {
      return res.json({
        success: false,
        errorMessage: "Attachment Id or progress Id is missing",
      });
    }

    const query = `
      SELECT * FROM view_taskattachment 
      WHERE attachment_id = :attachmentId 
      AND progressid = :progressId
    `;

    const bind = {
      attachmentId: Number(attachmentId),
      progressId: Number(progressId),
    };

    const result = await connection.execute(query, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rows = result.rows || [];

    for (const row of rows) {
      row.IMG = await lobToBase64(row.ATTACHMENT_DOC);

      delete row.ATTACHMENT_DOC;
    }

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("getAttachmentDetails error:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
}

module.exports = {
  getParentTaskDropdown,
  getTaskTypeDropdown,
  AOPT_TASK_INSUPD,
  AOPT_TASKSTATUS_INSUPD,
  getUlbDropdown,
  getTaskList,
  getStatusConfigList,
  getEmployeeMappingList,
  AOPT_TASKASSIGNMENT_INSUPD,
  getEmpDropdown,
  getStatusDropdown,
  getMyTaskList,
  AOPT_TASK_PROGRESS_upd,
  getTaskStatusList,
  getAttachmentDetails,
};
