pragma solidity ^0.8.0;

contract VendorRoster {
    // Keep a list of vendors along with when their
    // license approval status
    enum ApprovalStatus{ UNREVIEWED, PENDING, APPROVED }
    struct Status { 
      ApprovalStatus s;
      string cid;
    }

    mapping (address => Status) private roster;

    constructor () {
        // Do nothing
    }

    function submit_id (string memory cid) public {
        roster[msg.sender] = Status(ApprovalStatus.UNREVIEWED, cid);
    }

    function make_pending(address vendor_addr) public {
        roster[vendor_addr].s = ApprovalStatus.UNREVIEWED;
    }

    function approve(address vendor_addr) public {
        roster[vendor_addr].s = ApprovalStatus.UNREVIEWED;
    }

    function get_status(address vendor_addr) view public returns(ApprovalStatus) {
        return roster[vendor_addr].s;
    }
}