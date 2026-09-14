// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Bank} from "../src/Bank.sol";

contract BankTest is Test {
    Bank public bank;
    address public depositor;

    function setUp() public {
        bank = new Bank();
        depositor = makeAddr("depositor");
        vm.deal(depositor, 10 ether);
    }

    function test_Deposit() public {
        vm.prank(depositor);
        bank.deposit{value: 2 ether}();

        assertEq(bank.balances(depositor), 2 ether);
        assertEq(address(bank).balance, 2 ether);
    }

    function test_Withdraw() public {
        vm.startPrank(depositor);
        bank.deposit{value: 2 ether}();
        bank.withdraw(1 ether);
        vm.stopPrank();

        assertEq(bank.balances(depositor), 1 ether);
        assertEq(depositor.balance, 9 ether);
    }

    function test_RevertWhenWithdrawingTooMuch() public {
        vm.prank(depositor);
        vm.expectRevert("Insufficient balance");
        bank.withdraw(1 ether);
    }

    function test_RevertWhenDepositingZero() public {
        vm.prank(depositor);
        vm.expectRevert("Deposit must be greater than zero");
        bank.deposit{value: 0}();
    }
}